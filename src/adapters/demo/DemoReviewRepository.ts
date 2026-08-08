import type { Review } from "@/domain";
import type { ReviewRepository } from "@/repositories/types";
import { loadDemoJsonOrEmpty } from "./loadDemoData";

export class DemoReviewRepository implements ReviewRepository {
  private async reviews(): Promise<Review[]> {
    return loadDemoJsonOrEmpty<Review[]>("reviews/reviews.json", []);
  }

  async getAll(): Promise<Review[]> {
    return this.reviews();
  }

  async getByProduct(productId: string): Promise<Review[]> {
    const reviews = await this.reviews();
    return reviews.filter((review) => review.productId === productId);
  }

  async getFeatured(limit = 8): Promise<Review[]> {
    const reviews = await this.reviews();
    return reviews.slice(0, limit);
  }
}
