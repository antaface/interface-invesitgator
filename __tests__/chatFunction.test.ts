
import request from "supertest";
import handler from "@/functions/chat";

// Mock supabase
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      update: () => ({
        eq: () => ({
          error: null
        })
      })
    })
  }
}));

it("should return intro scene", async () => {
  const res = await handler({ body: {} } as any);
  const data = JSON.parse(res.body);
  expect(data.sceneId).toBe("intro");
  expect(data.choices.length).toBeGreaterThan(0);
});
