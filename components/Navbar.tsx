import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center px-4 w-full h-[10vh] bg-secondary border-b border-2 border-gray-400">
      <h3
        onClick={() => router.push("/home")}
        className="cursor-pointer font-semibold text-4xl text-accent"
      >
        Actify
      </h3>
      <div className="flex justify-center items-center gap-4">
        <a href="/home" className="cursor-pointer text-text">
          Browse
        </a>
        <a href="/myInitiatives" className="cursor-pointer text-text">
          My Initiatives
        </a>
        <a
          href="/initiative"
          className="flex justify-center items-center px-2 py-2 bg-accent rounded-lg cursor-pointer"
        >
          Start an Initiative
        </a>
      </div>
    </div>
  );
};

export default Navbar;
