import { getDatabaseClient } from "../../../../database/getClient";

import type {
  NextApiRequest as Request,
  NextApiResponse as Response,
} from "next";

const signIn = async (req: Request, res: Response) => {
  const {
    query: { userName, password },
  } = req;

  try {
    const signInQuery = `SELECT * FROM users WHERE username = '${userName}' AND password = '${password}';`;

    const client = getDatabaseClient();
    await client.connect();
    const result = await client.query(signInQuery);
    await client.clean();

    if (result.rowCount) {
      const user = result.rows[0];
      res.status(200).json(user);
    } else {
      res.status(401).json("User unauthorized");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export { signIn };