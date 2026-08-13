import { Request, Response } from "express";
import { overviewService } from "./overview.services";

const getAllOverview = async (req: Request, res: Response) => {
  const { year } = req.query;
  try {

    const result = await overviewService.getAllOverview(year as any);
    // const {monthlyData,overview}=result
    res.status(200).json({
      message: "Overview fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const overviewController = {
  getAllOverview,
};
