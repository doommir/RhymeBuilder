interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface LessonOptionProps {
  option: Option;
  isSelected: boolean;
  onSelect: () => void;
}

export default function LessonOption({ option, isSelected, onSelect }: LessonOptionProps) {
  return (
    <div 
      className={`question-option border-2 border-gray-200 rounded-xl p-4 flex items-center ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="flex-grow">
        <p className="font-poppins font-semibold">{option.text}</p>
      </div>
      <div className="checkbox w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
        <div className={`checkbox-inner w-3 h-3 bg-secondary rounded-full ${isSelected ? '' : 'hidden'}`}></div>
      </div>
    </div>
  );
}
