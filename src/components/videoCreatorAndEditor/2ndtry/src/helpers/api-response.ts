import { NextResponse } from "next/server";
import { z, ZodType } from "zod";

export type ApiResponse<Res> =
  | {
      data: Res;
      type: "success";
    }
  | {
      message: string;
      type: "error";
    };

export const executeApi =
  <Res, Req extends ZodType>(
    schema: Req,
    handler: (req: Request, body: z.infer<Req>) => Promise<Res>,
  ) =>
  async (req: Request) => {
    try {
      const payload = await req.json();
      const parsed = schema.parse(payload);
      const data = await handler(req, parsed);
      return NextResponse.json({
        data,
        type: "success",
      });
    } catch (err) {
      return NextResponse.json(
        { message: (err as Error).message, type: "error" },
        {
          status: 500,
        },
      );
    }
  };
