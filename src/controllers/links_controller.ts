import { Request, Response } from "express";
import { db } from "../db/drizzle";
import { shortenedLinkTable } from "../db/schema";
import { desc, eq, sql } from "drizzle-orm";
import assert from "node:assert";

const findLinkBySlug = async (slug: string) => {
  const result = await db
    .select()
    .from(shortenedLinkTable)
    .where(eq(shortenedLinkTable.slug, slug));
  return result[0] ?? null;
};

export const getLinks = async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(shortenedLinkTable)
      .orderBy(desc(shortenedLinkTable.createDate));
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
    const result = await db
      .insert(shortenedLinkTable)
      .values({
        slug,
        url,
        createDate: sql`NOW()`,
        updateDate: sql`NOW()`,
        clicks: 0,
        lastClick: null,
      })
      .returning();
    const createdLink = result[0];
    assert(createdLink);
    res.status(201).json(createdLink);
  } catch (err) {
    console.error("createLink Error: ", err);
    res.status(500).json({ error: "Internet Server Error" });
  }
};

export const gotoLink = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    assert(slug != null);
    const result = await db
      .update(shortenedLinkTable)
      .set({
        clicks: sql`${shortenedLinkTable.clicks} + 1`,
        lastClick: sql`NOW()`,
      })
      .where(eq(shortenedLinkTable.slug, slug))
      .returning();
    const targetLink = result[0];
    if (targetLink == null) {
      res.status(404).json({ error: "Slug not found" });
      return;
    }
    res.redirect(targetLink.url);
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
  if (originalSlug == null) {
    throw new Error("Slug is required");
  }
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
    const result = await db
      .update(shortenedLinkTable)
      .set({
        url,
        slug: newSlug,
        updateDate: sql`NOW()`,
      })
      .where(eq(shortenedLinkTable.slug, originalSlug))
      .returning();
    const updatedLink = result[0];
    if (updateLink == null) {
      res.status(404).json({ error: "Failed to update link" });
      return;
    }
    res.json({
      message: "Link updated successfully",
      link: updatedLink,
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
    assert(slug != null);
    const result = await db
      .delete(shortenedLinkTable)
      .where(eq(shortenedLinkTable.slug, slug))
      .returning();
    if (result.length === 0) {
      res.status(404).json({ error: "Slug not found" });
      return;
    }
    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    console.error("deleteLink Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
