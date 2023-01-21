import { registerUser } from "@/firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-black">
      <div className="flex justify-center items-center w-[50vh] rounded-xl border border-gray-400 py-8 flex-col">
        <h1 className="text-4xl text-white text-center">Register</h1>
        {/* form to register user asking for name, email, password */}
        <div className="flex flex-col w-3/4">
          <label htmlFor="name" className="text-white">
            Organization
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 rounded-md p-2 mb-4"
          />
          <label htmlFor="email" className="text-white">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded-md p-2 mb-4"
          />
          <label htmlFor="password" className="text-white">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded-md p-2 mb-4"
          />
          <button
            // type="submit"
            className="bg-blue-500 text-white rounded-md p-2 mt-4"
            onClick={async () => {
              if (name && password && email) {
                await registerUser(name, email, password);
                router.push("/home");
              }
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
