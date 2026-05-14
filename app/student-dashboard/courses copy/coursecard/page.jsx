import NextLink from "next/link";
import { Play, Edit, CheckCircle, Eye, Star } from "lucide-react";
import { formatCurrency } from "../formatter/page";

function StarRating({ rating }) {
  const ratingValue = rating || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3 h-3"
          fill={i <= Math.floor(ratingValue) ? "#f59e0b" : "none"}
          stroke={i <= Math.floor(ratingValue) ? "#f59e0b" : "#d1d5db"}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{ratingValue}</span>
    </div>
  );
}

export default function CourseCard({ course, onPublish }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="relative w-full h-36 flex-shrink-0">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.badge && (
          <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {course.badge}
          </span>
        )}
        {/* Status Badge */}
        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
          course.status === "Published" 
            ? "bg-green-500 text-white" 
            : "bg-yellow-400 text-yellow-900"
        }`}>
          {course.status}
        </span>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{course.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {course.lessons && `${course.lessons} Lessons · `}{course.type}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Eye className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{course.students} Students</span>
              <span className="mx-1 text-gray-300">·</span>
              <StarRating rating={course.rating} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400">Price</p>
            <p className="text-xs font-bold text-gray-800">{formatCurrency(course.price)}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Preview Button */}
            {course.type === "Hardcopy" ? (
              <NextLink
                href={`/tutor-dashboard/courses/hardcopy?courseId=${course.id}&status=${course.status}`}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                Preview
              </NextLink>
            ) : (
              <NextLink
                href={`/tutor-dashboard/courses/coursedetails?courseId=${course.id}&status=${course.status}`}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                Preview
              </NextLink>
            )}

            {/* Publish Button - Only for Draft courses */}
            {course.status === "Draft" && (
              <button 
                onClick={() => onPublish(course.id)}
                className="px-3 py-1.5 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Publish
              </button>
            )}

            {/* Edit Button */}
            <button className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center gap-1">
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}