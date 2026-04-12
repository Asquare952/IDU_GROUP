"use client";
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "../../api/features/auth/auth.queries";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();
  const { mutate: registerUser, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    let phone = data.phone_no;
    if (/^0\d{10}$/.test(phone)) {
      phone = "+234" + phone.slice(1);
    } else if (/^\d{10}$/.test(phone)) {
      phone = "+234" + phone;
    }

    const payload = {
      ...data,
      phone_no: phone,
    };

    registerUser(payload, {
      onSuccess: () => {
        toast.success("Account created successfully! Please login.");
        router.push("/login");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Registration failed");
      },
    });
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-10 overflow-hidden">
        <div className="absolute top-8 left-8 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-[#4CAF50] transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="absolute inset-0 z-0">
          <Image
            src="/IDU GROUP HOME.png"
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover blur-3xl brightness-[0.4] scale-110"
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl bg-white rounded-[45px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[750px] mt-12 md:mt-0">
          <div className="hidden md:block w-1/2 relative p-5">
            <div className="relative w-full h-full rounded-[35px] overflow-hidden">
              <Image
                src="/IDU GROUP HOME.png"
                alt="RentULO"
                fill
                priority
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 justify-center text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-1.5 rounded-full flex items-center border border-gray-200">
                <button className="px-8 py-2.5 bg-[#4CAF50] text-white text-sm font-bold rounded-full shadow-lg">
                  Sign up
                </button>
                <Link
                  href="/login"
                  className="px-8 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
                >
                  Log in
                </Link>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Create Your Rent<span className="text-[#4CAF50]">ULO</span>
              Account
            </h1>
            <p className="text-gray-500 text-sm font-medium mb-6">
              Fill in your details to get started
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-left overflow-y-auto pr-2 max-h-[550px]"
            >
              <div className="grid gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                      <User size={16} />
                    </span>
                    <input
                      {...register("first_name", {
                        required: "First name is required",
                      })}
                      placeholder="First Name"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50] transition-all"
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                      <User size={16} />
                    </span>
                    <input
                      {...register("last_name", {
                        required: "Last name is required",
                      })}
                      placeholder="Last Name"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50] transition-all"
                    />
                  </div>
                </div>
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.last_name.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Phone No
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                      <Phone size={16} />
                    </span>
                    <input
                      {...register("phone_no", {
                        required: "Phone number is required",
                      })}
                      type="tel"
                      placeholder="+234 905."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50]"
                    />
                  </div>
                  {errors.phone_no && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone_no.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                    <Mail size={16} />
                  </span>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                      },
                    })}
                    type="email"
                    placeholder="example@rentulonigeria.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                      <MapPin size={16} />
                    </span>
                    <input
                      {...register("address", {
                        required: "Address is required",
                      })}
                      type="text"
                      placeholder="123 Street"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    State
                  </label>
                  <input
                    {...register("state", {
                      required: "State is required",
                    })}
                    type="text"
                    placeholder="Lagos"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                    <Lock size={16} />
                  </span>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-[#4CAF50]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message as string}
                  </p>
                )}
              </div>

              <div className="flex justify-center gap-8 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="landlord"
                    {...register("role", {
                      required: "Please select a role",
                    })}
                  />
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-[#4CAF50]">
                    Landlord?
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="tenant"
                    {...register("role", {
                      required: "Please select a role",
                    })}
                  />
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-[#4CAF50]">
                    Tenant?
                  </span>
                </label>
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs text-center">
                  {errors.role.message as string}
                </p>
              )}

              <p className="text-[10px] text-gray-400 text-center">
                By creating an account, you agree to our
                <Link
                  href="/terms"
                  className="text-[#4CAF50] font-bold hover:underline ml-1"
                >
                  Terms and Conditions
                </Link>
              </p>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-tighter">
                  <span className="bg-white px-3 text-gray-400 font-bold">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#ECF5ED] py-3 rounded-2xl hover:bg-[#e2ede3] transition-all font-bold text-xs text-gray-700"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4 cursor-pointer"
                    alt="Google"
                  />
                  Google
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#ECF5ED] py-3 rounded-2xl hover:bg-[#e2ede3] transition-all font-bold text-xs text-gray-700"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                    className="w-4 h-4"
                    alt="Apple"
                  />
                  Apple
                </button>
              </div>

              <button
                className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold hover:bg-[#43A047] shadow-xl shadow-green-100 transition-all active:scale-[0.98] cursor-pointer"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Creating Account..." : "Sign up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
