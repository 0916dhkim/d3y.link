import { Request, Response } from "express";
import pool from "../db/data_connect";

export const getLinks = async (req: Request, res: Response) => {
    try {
        const query = "SELECT * FROM shortened_links ORDER BY create_date DESC;";
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createLink = async (req: Request, res: Response): Promise<void> => {
    const { slug, url } = req.body;

    if (!slug || !url) {
        res.status(400).json({ error: "Slug and url should be filled" });
        return;
    }

    try {
        const findingQuery = `SELECT * from shortened_links
                                Where slug = $1;`;
        const findingLink = await pool.query(findingQuery, [slug]);
        if (findingLink.rows.length > 0) {
            res.status(409).json({ error: "Slug already exists" });
            return;
        }
        const createQuery = `INSERT INTO shortened_links(slug, url, create_date, update_date, clicks, last_click)
                                VALUES ($1, $2, NOW(), NOW(), 0, NULL)
                                RETURNING *`;
        const createLink = await pool.query(createQuery, [slug, url]);
        res.status(201).json(createLink.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internet Server Error" });
    }
};

export const gotoLink = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    try {
        const findingQuery = `UPDATE shortened_links
                        SET clicks = clicks + 1, last_click = NOW()
                        WHERE slug = $1
                        RETURNING *;`;
        const findingLink = await pool.query(findingQuery, [slug]);
        if (findingLink.rows.length === 0) {
            res.status(404).json({ error: "Slug not found" });
            return;
        }
        res.redirect(findingLink.rows[0].url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateLink = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const { url } = req.body;

    if (!url) {
        res.status(400).json({ message: "url should be filled" });
        return;
    }

    const findingQuery = `SELECT * from shortened_links
                                Where slug = $1;`;
    const findingLink = await pool.query(findingQuery, [slug]);
    if (findingLink.rows.length === 0) {
        res.status(404).json({ error: "Slug not found" });
        return;
    }
    try {
        const updateQuery = `UPDATE shortened_links
                                SET url = $1
                                WHERE slug = $2
                                RETURNING *;`;
        const updateLink = await pool.query(updateQuery, [url, slug]);
        if (updateLink.rows.length === 0) {
            res.status(404).json({ error: "update failed" });
            return;
        }
        res.json({ message: "Link updated successfully", link: updateLink.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteLink = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const findingQuery = `SELECT * from shortened_links
                                Where slug = $1;`;
    const findingLink = await pool.query(findingQuery, [slug]);
    if (findingLink.rows.length === 0) {
        res.status(404).json({ error: "Slug not found" });
        return;
    }

    try {
        const deleteQuery = `DELETE FROM shortened_links 
                                WHERE slug = $1 RETURNING *;`;
        const deleteLink = await pool.query(deleteQuery, [slug]);
        if (deleteLink.rows.length !== 0) {
            res.json({ message: "Link deleted successfully" });
        } else {
            res.status(400).json({ error: "delete is failed" });
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
