import type { APISpaceXResponse, Doc } from "../types/api";

interface LaunchDetails {
  name: string;
  id: string;
  img: string;
  details: string;
  success: boolean;
}

export const getLaunchByID = async ({id}: { id: string }) => {
  const res = await fetch(`https://api.spacexdata.com/v5/launches/${id}`);

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const launch = (await res.json()) as Doc;
  console.log(launch)
  return launch;
};

export const getLaunches = async (
  name: string
): Promise<LaunchDetails | LaunchDetails[]> => {
  try {
    if (name !== "") {
      const res = await fetch("https://api.spacexdata.com/v5/launches");

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const launches = (await res.json()) as APISpaceXResponse["docs"];
      const found = launches.find((e) => e.name === name);

      if (found) {
        return {
          name: found.name,
          id: found.id,
          img: found.links.patch.small,
          details: found.details,
          success: found.success,
        };
      } else {
        throw new Error(`No se encontró el lanzamiento con el nombre: ${name}`);
      }
    } else {
      const res = await fetch("https://api.spacexdata.com/v5/launches/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {},
          options: {
            sort: {
              date_unix: "asc",
            },
            limit: 12,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const { docs: launches } = (await res.json()) as APISpaceXResponse;

      return launches.map(({ name, id, links, details, success }) => ({
        name: name,
        id: id,
        img: links.patch.small,
        details: details,
        success: success,
      }));
    }
  } catch (e) {
    console.error("Error fetching launch details:", e);
    return [];
  }
};
