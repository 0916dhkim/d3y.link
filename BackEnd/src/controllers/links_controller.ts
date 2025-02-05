import { Request, Response } from "express";
import pool from "../db/data_connect";

export const getLinks = async (req: Request, res: Response) => {
    try {
        const query = "SELECT * FROM shortened_urls ORDER BY create_date DESC;";
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
    }
};

export const createLink = async (req: Request, res: Response) => {
    // create link
};
export const gotoLink = async (req: Request, res: Response) => {
    // go to link
};
export const updateLink = async (req: Request, res: Response) => {
    // update link
};
export const deleteLink = async (req: Request, res: Response) => {
    // delete link
};
