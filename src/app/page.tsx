"use client";

import { useState } from "react";

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  imageUrl?: string;
}

const defaultImageUrl =
  "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerms, setSearchTerms] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const onChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchTerms) {
      setSearchError("Please enter a search to get started");
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    fetch(`/api/advocates?query=${encodeURIComponent(searchTerms)}`)
      .then((response) => response.json())
      .then((data) => {
        setAdvocates(data);
        if (data.length < 1) {
          setSearchError(
            "No search results found. Please make a different search"
          );
        }
      })
      .catch((err: any) =>
        setSearchError("Something went wrong. Please try your search again.")
      )
      .finally(() => setIsLoading(false));
  };

  return (
    // Search Hero
    <main style={{ margin: "24px" }}>
      <div className="relative h-[400px] bg-gradient-to-tr from-green-950 to-zinc-900">
        <div className="flex flex-col gap-4 justify-center items-center w-full h-full px-3 md:px-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Solace Advocates
          </h1>
          <p className="text-gray-300">Help is on the way</p>

          <div className="relative p-3 border border-gray-200 rounded-lg w-full max-w-lg">
            <input
              type="text"
              className="rounded-md w-full p-3 "
              placeholder="Find an advocate"
              onChange={(e) => setSearchTerms(e.target.value)}
              onKeyDown={onChange}
              value={searchTerms}
            />

            <button
              type="submit"
              className="absolute right-6 top-6"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="content-center">
          {/* loadingSpinner */}
          {isLoading && (
            <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
              <svg
                className="w-12 h-12 text-gray-300 animate-spin"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-900"
                ></path>
              </svg>
            </div>
          )}

          {/* Error Message */}
          {searchError && <h2>{searchError}</h2>}

          {/* Search Results */}
          {advocates.length &&
            advocates.map((advocate) => {
              return (
                <div
                  className="bg-white rounded-xl shadow-2xl max-w-6xl w-full p-8 m-8"
                  key={advocate.id}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 text-center mb-8 md:mb-0">
                      <img
                        src={
                          advocate.imageUrl
                            ? advocate.imageUrl
                            : defaultImageUrl
                        }
                        alt="Profile Picture"
                        className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-emerald-800"
                      />
                      <h1 className="text-2xl font-bold mb-2">
                        {advocate.firstName} {advocate.lastName},{" "}
                        {advocate.degree}
                      </h1>
                      <p className="text-gray-600">
                        {advocate.yearsOfExperience} years of experience
                      </p>
                    </div>
                    <div className="md:w-2/3 md:pl-8">
                      <h2 className="text-xl font-semibold mb-4">
                        Specialities
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {advocate.specialties.map((speciality) => (
                          <span
                            key={speciality}
                            className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm cursor-pointer"
                            onClick={() => setSearchTerms(speciality)}
                          >
                            {speciality}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-xl font-semibold mb-4">
                        Contact Information
                      </h2>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-emerald-800"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {advocate.phoneNumber}
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-emerald-800"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {advocate.city}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
