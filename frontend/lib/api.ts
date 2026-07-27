import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import END_POINTS from "@/constants/endpoints";
import "server-only";

export type WithPagination<T> = {
  count: number;
  next: null | string;
  previous: null | string;
  results: T[];
};

export type ApiResponse<T> =
  | {
      status: true;
      message: string;
      data: T;
      errors: { [key: string]: string | string[] } | null;
    }
  | {
      status: false;
      message: string;
      data: Record<PropertyKey, never>;
      errors: { [key: string]: string | string[] } | null;
    };

export const myFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  let out: ApiResponse<T> = {
    status: false,
    message: "Something went wrong!",
    data: {},
    errors: null,
  };
  const status = {
    code: 200,
    ok: true,
  };

  try {
    const response = await fetch(url, options);
    status.code = response.status;
    status.ok = response.ok;

    if (status.code === 204) {
      out = {
        status: true,
        message: "Resource deleted successfully",
        data: {} as T,
        errors: null,
      };
    } else {
      out = await response.json();
    }
  } catch (error) {
    console.log("Fetch failed", error);
  }
  //   if (
  //     (status.code === 403 || status.code === 401) &&
  //     !url.includes(END_POINTS.SIGN_IN)
  //   ) {
  //     const from = await getCurrentPath();
  //     redirect(
  //       `/refresh-and-retry?from=${encodeURIComponent(from)}&trigger=refresh_token`,
  //     );
  //   }
  return out;
};

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return token;
}
