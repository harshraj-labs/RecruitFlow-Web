// A reusable card that shows a statistic
interface StatCardProps {
    title: string;
    value: number;
    color: string;
    icon: string;
}

function StatCard({ title, value, color, icon }: StatCardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm font-medium">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                        {value}
                    </p>
                </div>
                <span className="text-4xl">{icon}</span>
            </div>
        </div>
    );
}

export default StatCard;