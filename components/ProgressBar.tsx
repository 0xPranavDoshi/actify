const ProgressBar = ({
  bgcolor,
  completed,
}: {
  bgcolor: string;
  completed: number;
}) => {
  return (
    <div className="h-6 bg-secondary rounded-full w-full">
      <div
        style={{ width: `${completed}%` }}
        className="text-right h-full bg-accent2 rounded-[inherit] flex justify-center w-full"
      >
        <span className="text-white font-semibold flex justify-center items-center">{`${completed.toFixed(
          0
        )}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
