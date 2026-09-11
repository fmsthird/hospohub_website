import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function MobileMenu({
  open,
  setOpen,
  links,
}) {

  if (!open) return null;


  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        bg-black/40
        lg:hidden
      "
      onClick={() => setOpen(false)}
    >

      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-72
          bg-white
          shadow-xl
          p-5
        "
        onClick={(e)=>e.stopPropagation()}
      >

        <div
          className="
            flex
            justify-between
            items-center
            mb-6
          "
        >

          <h2 className="font-bold text-lg">
            Menu
          </h2>

          <button
            onClick={()=>setOpen(false)}
            className="text-xl"
          >
            <FaTimes />
          </button>

        </div>


        <nav className="flex flex-col gap-2">

          {links.map((item)=>(
            <Link
              key={item.path}
              to={item.path}
              onClick={()=>setOpen(false)}
              className="
                px-4
                py-3
                rounded-md
                text-gray-700
                hover:bg-blue-50
              "
            >
              {item.name}
            </Link>
          ))}

        </nav>


      </div>

    </div>
  );
}