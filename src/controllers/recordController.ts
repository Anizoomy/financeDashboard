import { Request, Response } from "express";
import {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../services/recordService";

export async function getRecordsController(req: Request, res: Response) {
  try {
    const { type, category, startDate, endDate, page, limit } = req.query;
    const result = await getRecords({
      type: type as string,
      category: category as string,
      startDate: startDate as string,
      endDate: endDate as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(result);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getRecordByIdController(req: Request, res: Response) {
  try {
    const record = await getRecordById(req.params.id as string);
    res.json({ record });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function createRecordController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const record = await createRecord(req.body, userId);
    res.status(201).json({ message: "Record created", record });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function updateRecordController(req: Request, res: Response) {
  try {
    const record = await updateRecord(req.params.id as string, req.body);
    res.json({ message: "Record updated", record });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function deleteRecordController(req: Request, res: Response) {
  try {
    await deleteRecord(req.params.id as string);
    res.json({ message: "Record deleted successfully" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}