"use client";

import { mailAction } from "@/actions/aregister/mailaction";
import { RegisterAction } from "@/actions/aregister/registeraction";
import { usernameAction } from "@/actions/aregister/usernameaction";
import FsForm from "@/components/shared/form/fsform";
import { TRegisterUser } from "@/interface";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { useRouter } from "next/navigation";

const CmRegister = () => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const router = useRouter();
  const onSubmit = async (data: FieldValues) => {
    setSubmitLoading(true);
    delete data.cPassword;
    const register = await RegisterAction(data as TRegisterUser);
    if (register?.statusCode === 200) {
      setSubmitLoading(false);
      Confirm.show(
        "Congratulations 🎉",
        "Your account successfully created, please check your mail.",
        "{ Sign In }",
        "Stay here",
        () => {
          router.push("/auth/login");
        },
        () => {}
      );
    } else {
      setSubmitLoading(false);
      Confirm.show(
        "Oops, Something went wrong",
        "Error while opening an Account, please try again later!",
        "{ Back }",
        "Stay here",
        () => {
          router.push("/");
        },
        () => {}
      );
    }
  };

  return (
    <FsForm onSubmit={onSubmit}>
      <CmRegisterValues loading={submitLoading} />
    </FsForm>
  );
};

const CmRegisterValues = ({ loading }: { loading: boolean }) => {
  const { register, watch } = useFormContext();

  const [password] = watch(["password"]);

  const [mailError, setMailError] = useState<string>();
  const [usernameError, setUsernameError] = useState<string>();

  const [matchPassword, setMatchPassword] = useState<string>();

  const [error, setError] = useState<boolean>(false);

  function noSpaces(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  const checkingUserName = async (str: string) => {
    setUsernameError(`available checking...`);
    if (str.length === 0) {
      setError(true);
      return setUsernameError("No spaces allowed");
    }

    const usernameExistOrNot = await usernameAction(str);

    if (usernameExistOrNot?.statusCode === 200) {
      setError(false);
      setUsernameError(`congrats, available`);
    } else {
      setUsernameError(`oops! not available`);
      setError(true);
    }
  };

  const checkingMail = async (str: string) => {
    const mailExistOrNot = await mailAction(str);
    if (mailExistOrNot?.statusCode === 200) {
      setError(false);
      setMailError("");
    } else if (!mailExistOrNot?.success) {
      setError(true);
      setMailError(`oops! already exist`);
    }
  };

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    checkingUserName(e.target.value);
  };
  const onChangeMail = (e: ChangeEvent<HTMLInputElement>) => {
    checkingMail(e.target.value);
  };

  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const cPassword = e.target.value;
    if (cPassword && password) {
      if (cPassword === password) {
        setError(false);
        setMatchPassword("");
      } else {
        setError(true);
        setMatchPassword("password not match");
      }
    }
  };

  return (
    <>
      <div className="tooltip">
        <input
          type="text"
          {...register("username")}
          placeholder="Username"
          required
          pattern="^\S*$"
          onKeyDown={(event) => noSpaces(event)}
          onChange={(e) => onChangeUsername(e)}
        />
        <span className="tooltip-text">
          {usernameError ? usernameError : "No spaces allowed"}
        </span>
      </div>

      <div className="tooltip">
        <input
          type="email"
          {...register("email")}
          onKeyDown={(event) => noSpaces(event)}
          placeholder="Email"
          required
          onChange={(e) => onChangeMail(e)}
        />
        {mailError && <span className="tooltip-text">{mailError}</span>}
      </div>
      <input
        type="password"
        {...register("password")}
        onKeyDown={(event) => noSpaces(event)}
        placeholder="Password"
        required
      />

      <div className="tooltip">
        <input
          type="password"
          {...register("cPassword")}
          placeholder="Confirm Password"
          onKeyDown={(event) => noSpaces(event)}
          required
          className={matchPassword && "!outline !outline-red-400 !outline-1"}
          disabled={!password}
          onChange={(e) => onChangeConfirmPassword(e)}
        />
        {mailError && <span className="tooltip-text">{mailError}</span>}
        {!password && <span className="tooltip-text">type, password 1st</span>}
        {matchPassword && <span className="tooltip-text">{matchPassword}</span>}
      </div>
      <button
        disabled={loading || error}
        className={`mb-8  ${loading || (error && "!cursor-not-allowed")}`}
        type="submit">
        {loading ? "Loading." : "{ Sign Up }"}
      </button>
    </>
  );
};

export default CmRegister;
