import { registerUser, signInUser } from "@/firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-background flex-col">
      <h1 className="text-5xl font-light mb-8 text-accent">EcoElevate</h1>
      <div className="flex justify-center items-center w-[50vh] rounded-xl border border-gray-400 py-8 flex-col">
        <h1 className="text-4xl text-white text-center">Login</h1>
        <div className="flex flex-col w-3/4">
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
            className="bg-accent text-white rounded-md p-2 mt-4"
            onClick={async () => {
              if (password && email) {
                try {
                  let user = await signInUser(email, password);
                  console.log(user);
                  if (user) router.push("/home");
                } catch (err) {
                  console.log(err);
                }
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
