import { getAuthSession } from "./auth";
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { z } from "zod";

export const action = createSafeActionClient();
export class ServerError extends Error {}
class ActionError extends Error {}
// This is the base action client that can be used for any action.
// It can be extended with additional middleware or functionality as needed.
// It is used to define the base structure for actions, including error handling and logging.

// Base client.
const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleServerError(e) {
    console.error("Action error:", e.message);

    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  // Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  const startTime = performance.now();

  // Here we await the action execution.
  const result = await next();

  const endTime = performance.now();

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);
  console.log("Action execution took", endTime - startTime, "ms");

  // And then return the result of the awaited action.
  return result;
});

// Auth client defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client
// will also be used for this one.
export const authActionClient = actionClient
  // Define authorization middleware.
  .use(async ({ next }) => {
    const session = await getAuthSession();

    const user = session?.user;
    const userId = user?.id;

    if (!userId) {
      throw new ServerError("You must be logged in to perform this action");
    }

    // Return the next middleware with `userId` value in the context
    return next({ ctx: { user, userId } });
  });
