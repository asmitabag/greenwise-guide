
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProductFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ProductForm = ({ onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    image_url: "",
    eco_features: [],
    sustainability_score: 0,
    verification_data: {
      brand_verification: "",
      product_certification: "",
      market_existence_proof: ""
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Product Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url">Product Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Verification Information</Label>
          <div className="grid gap-4">
            <Input
              placeholder="Brand Verification (e.g., official website link)"
              value={formData.verification_data.brand_verification}
              onChange={(e) => setFormData({
                ...formData,
                verification_data: {
                  ...formData.verification_data,
                  brand_verification: e.target.value
                }
              })}
              required
            />
            <Input
              placeholder="Product Certification (if applicable)"
              value={formData.verification_data.product_certification}
              onChange={(e) => setFormData({
                ...formData,
                verification_data: {
                  ...formData.verification_data,
                  product_certification: e.target.value
                }
              })}
            />
            <Input
              placeholder="Market Existence Proof (e.g., retail listing)"
              value={formData.verification_data.market_existence_proof}
              onChange={(e) => setFormData({
                ...formData,
                verification_data: {
                  ...formData.verification_data,
                  market_existence_proof: e.target.value
                }
              })}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Submit for Verification
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProductForm;
