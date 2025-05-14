import { Request, Response } from "express";
import pool from "../db/data_connect";

const findLinkBySlug = async (slug: string) => {
  const result = await pool.query(
    "SELECT * FROM shortened_links WHERE slug = $1;",
    [slug],
  );
  return result.rows[0];
};

export const getLinks = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM shortened_links ORDER BY create_date DESC;";
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("getLinks Error: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createLink = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { slug, url } = req.body;

  if (!slug || !url) {
    res.status(400).json({ error: "URL and slug are required" });
    return;
  }

  try {
    const existing = await findLinkBySlug(slug);
    if (existing) {
      res.status(409).json({ error: "Slug already exists" });
      return;
    }
    const createQuery = `INSERT INTO shortened_links(slug, url, create_date, update_date, clicks, last_click)
                                VALUES ($1, $2, NOW(), NOW(), 0, NULL)
                                RETURNING *`;
    const createLink = await pool.query(createQuery, [slug, url]);
    res.status(201).json(createLink.rows[0]);
  } catch (err) {
    console.error("createLink Error: ", err);
    res.status(500).json({ error: "Internet Server Error" });
  }
};

export const gotoLink = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    const updateQuery = `
            UPDATE shortened_links
            SET clicks = clicks + 1, last_click = NOW()
            WHERE slug = $1
            RETURNING url;
        `;
    const findingLink = await pool.query(updateQuery, [slug]);
    if (findingLink.rows.length === 0) {
      res.status(404).json({ error: "Slug not found" });
      return;
    }
    res.redirect(findingLink.rows[0].url);
  } catch (err) {
    console.error("gotoLink Error: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateLink = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const originalSlug = req.params.slug;
  const { url, slug: newSlug } = req.body;

  if (!url || !newSlug) {
    res.status(400).json({ error: "Both URL and slug are required" });
    return;
  }

  try {
    const existing = await findLinkBySlug(originalSlug);
    if (!existing) {
      res.status(404).json({ error: "Slug not found" });
      return;
    }

    if (newSlug !== originalSlug) {
      const slugExists = await findLinkBySlug(newSlug);
      if (slugExists) {
        res.status(409).json({ error: "Slug already exists" });
        return;
      }
    }
    const updateQuery = `UPDATE shortened_links
                        SET url = $1, slug = $2, update_date = NOW()
                        WHERE slug = $3
                        RETURNING *;`;
    const updateLink = await pool.query(updateQuery, [
      url,
      newSlug,
      originalSlug,
    ]);
    if (updateLink.rows.length === 0) {
      res.status(404).json({ error: "Failed to update link" });
      return;
    }
    res.json({
      message: "Link updated successfully",
      link: updateLink.rows[0],
    });
  } catch (err) {
    console.error("updateLink Error: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteLink = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { slug } = req.params;

  try {
    const deleteQuery = `DELETE FROM shortened_links 
                                WHERE slug = $1 RETURNING *;`;
    const deleteLink = await pool.query(deleteQuery, [slug]);
    if (deleteLink.rows.length === 0) {
      res.status(404).json({ error: "Slug not found" });
      return;
    }
    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    console.error("deleteLink Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
