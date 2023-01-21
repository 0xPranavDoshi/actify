const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-4 w-full h-[10vh] bg-secondary border-b border-2 border-gray-400">
      <h3 className="font-semibold text-4xl text-accent">Actify</h3>
      <div className="flex justify-center items-center gap-4">
        <p className="cursor-pointer">My Initiatives</p>
        <div className="flex justify-center items-center px-2 py-2 bg-accent rounded-lg">
          Start an Initiative
        </div>
      </div>
    </div>
  );
};

export default Navbar;
