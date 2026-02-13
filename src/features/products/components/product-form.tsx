"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategoryList } from "@/features/categories/api/getCategoryList";
import type { Product } from "../types";

export interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
}

const DEFAULT_VALUES: ProductFormValues = {
  title: "",
  description: "",
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  brand: "",
  category: "",
};

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ProductForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(() => {
    const merged = { ...DEFAULT_VALUES, ...initialValues };
    return {
      title: merged.title ?? "",
      description: merged.description ?? "",
      price: merged.price ?? 0,
      discountPercentage: merged.discountPercentage ?? 0,
      rating: merged.rating ?? 0,
      stock: merged.stock ?? 0,
      brand: merged.brand ?? "",
      category: merged.category ?? "",
    };
  });
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<
    { slug: string; name: string }[]
  >([]);

  useEffect(() => {
    const controller = new AbortController();
    getCategoryList(controller.signal)
      .then((list) =>
        setCategories(list.map((c) => ({ slug: c.slug, name: c.name }))),
      )
      .catch(() => setCategories([]));
    return () => controller.abort();
  }, []);

  const categoryOptions = [...categories];
  if (
    values.category &&
    !categoryOptions.some((c) => c.slug === values.category)
  ) {
    const name = values.category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    categoryOptions.unshift({ slug: values.category, name });
  }

  const handleChange = (
    field: keyof ProductFormValues,
    value: string | number,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={values.title ?? ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Product title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Product description"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step={0.01}
            value={values.price != null ? values.price : ""}
            onChange={(e) =>
              handleChange("price", parseFloat(e.target.value) || 0)
            }
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min={0}
            max={100}
            step={0.001}
            value={
              values.discountPercentage != null ? values.discountPercentage : ""
            }
            onChange={(e) =>
              handleChange(
                "discountPercentage",
                parseFloat(e.target.value) || 0,
              )
            }
            placeholder="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min={0}
            value={values.stock != null ? values.stock : ""}
            onChange={(e) =>
              handleChange("stock", parseInt(e.target.value, 10) || 0)
            }
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min={0}
            max={5}
            step={0.001}
            value={values.rating != null ? values.rating : ""}
            onChange={(e) =>
              handleChange("rating", parseFloat(e.target.value) || 0)
            }
            placeholder="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={values.brand ?? ""}
            onChange={(e) => handleChange("brand", e.target.value)}
            placeholder="Brand name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={values.category || "__select__"}
            onValueChange={(v) =>
              handleChange("category", v === "__select__" ? "" : v)
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__select__">Select category</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || !values.title.trim()}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function toProductInput(values: ProductFormValues): Omit<Product, "id"> {
  return {
    title: values.title.trim(),
    description: values.description.trim() || "No description",
    price: values.price || 0,
    discountPercentage: values.discountPercentage || 0,
    rating: values.rating || 0,
    stock: values.stock || 0,
    brand: values.brand.trim() || "Generic",
    category: values.category.trim() || "uncategorized",
    thumbnail: "https://placehold.co/400x400/png?text=No+Image",
    images: ["https://placehold.co/400x400/png?text=No+Image"],
  };
}
