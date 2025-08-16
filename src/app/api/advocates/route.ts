import db from "../../../db";
import { advocates } from "@/db/schema";
import { sql } from "drizzle-orm";

export interface AdvocateFromEntity {
  id: number;
  first_name: string;
  last_name: string;
  city: string;
  degree: string;
  payload: string;
  years_of_experience: number;
  phone_number: number;
  created_at: Date;
  rank?: number;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    let results;
    if (!query) {
      //TODO: some kind better handling if no query sent in. Based on location maybe?
      results = await db.select().from(advocates);
      return Response.json(results);
    } else {
      const formattedQuery = query
        .replace(/[()&]/g, " ")
        .trim()
        .split(/\s+/)
        .map((word) => `${word}:*`)
        .join(" & ");

      results = await db.execute(
        sql`
        SELECT *,
          ts_rank(
            setweight(to_tsvector('english', coalesce(payload::text, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(first_name, '') || ' ' || coalesce(last_name, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(degree, '')), 'C') ||
            setweight(to_tsvector('english', coalesce(city, '')), 'D'),
            to_tsquery('english', ${formattedQuery})
          ) AS rank
        FROM ${advocates}
        WHERE to_tsvector('english',
            coalesce(first_name, '') || ' ' ||
            coalesce(last_name, '') || ' ' ||
            coalesce(city, '') || ' ' ||
            coalesce(degree, '') || ' ' ||
              coalesce(payload::text, '')
          )
          @@ plainto_tsquery('english', ${formattedQuery})
        ORDER BY rank DESC;
      `
      );

      const toDtoResults = (results as AdvocateFromEntity[]).map((result) => {
        return {
          id: result.id,
          firstName: result.first_name,
          lastName: result.last_name,
          city: result.city,
          degree: result.degree,
          specialties: JSON.parse(result.payload),
          yearsOfExperience: result.years_of_experience,
          phoneNumber: result.phone_number
            .toString()
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
        };
      });
      return Response.json(toDtoResults);
    }
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
