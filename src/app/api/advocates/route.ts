import { NextResponse } from "next/server";
import db from "../../../db";
import { advocates } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    //TOOD: some kind of handling if no query sent in. Based on location maybe?

    const results = await db.execute(
      sql`
        SELECT *,
          ts_rank(
            to_tsvector('english',
              coalesce(first_name, '') || ' ' ||
              coalesce(last_name, '') || ' ' ||
              coalesce(city, '') || ' ' ||
              coalesce(degree, '')
            ),
            plainto_tsquery('english', ${query})
          ) AS rank
        FROM ${advocates}
        WHERE to_tsvector('english',
            coalesce(first_name, '') || ' ' ||
            coalesce(last_name, '') || ' ' ||
            coalesce(city, '') || ' ' ||
            coalesce(degree, '')
          )
          @@ plainto_tsquery('english', ${query})
        ORDER BY rank DESC;
      `
    );

    return Response.json(results);
  } catch (e) {
    console.log(e);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
