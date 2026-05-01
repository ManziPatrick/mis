export default function Cards({
    icon,
    title,
    value,
    color,
  }: {
    icon: React.ReactNode;
    title: React.ReactNode;
    value: React.ReactNode;
    color: string; // Assuming color is a valid Tailwind class string
  }) {
    return (
      <div className="bg-white border px-4 py-6 rounded-md shadow-sm">
        <div className="flex flex-row gap-5 justify-between items-center">
          {/* Icon Section */}
          <div
            className={`flex justify-center items-center ${color} w-12 h-12 rounded-full`}
          >
            {icon}
          </div>
          {/* Text Section */}
          <div>
            <div className="flex flex-col gap-1">
              <span
                className="t font-bold overflow-hidden text-ellipsis max-w-[150px]"
                style={{
                  fontSize:
                    typeof value === "string" && value.length > 6 ? "6px" : "12px",
                }}
                title={typeof value === "string" ? value : String(value)}
              >
                {value}
              </span>
              <span className="text-[14px] text-gray-600 font-bold">{title}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  