import { apiRequest } from './queryClient';

// Function to convert a Blob to base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract the base64 data (remove the data URL prefix)
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Function to transcribe audio using OpenAI Whisper API
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transcription failed: ${errorText}`);
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

// Function to split transcription into lines/sentences
export const splitTranscription = (text: string): string[] => {
  // Split by sentence-ending punctuation
  return text
    .split(/(?<=[.!?])\s+/g)
    .filter(line => line.trim().length > 0)
    .map(line => line.trim());
};

// Setup audio recording with MediaRecorder
export const setupAudioRecording = (): Promise<{
  startRecording: () => void;
  stopRecording: () => Promise<Blob>;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      reject(new Error('Media devices not supported in this browser'));
      return;
    }
    
    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.addEventListener('dataavailable', (event) => {
          audioChunks.push(event.data);
        });
        
        const startRecording = () => {
          audioChunks = [];
          mediaRecorder?.start();
        };
        
        const stopRecording = (): Promise<Blob> => {
          return new Promise((resolve) => {
            mediaRecorder?.addEventListener('stop', () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              resolve(audioBlob);
            }, { once: true });
            
            mediaRecorder?.stop();
            
            // Stop all audio tracks in the stream
            stream.getAudioTracks().forEach(track => track.stop());
          });
        };
        
        resolve({ startRecording, stopRecording });
      })
      .catch(error => {
        reject(error);
      });
  });
};