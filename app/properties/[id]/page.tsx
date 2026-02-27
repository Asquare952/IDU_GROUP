"use client";
import { useParams } from "next/navigation";
import propertiesLocal from "@/app/components/properties";

export default function PropertyDetails() {
  const { id } = useParams();

  const property = propertiesLocal.find((p) => String(p.id) === String(id));

  if (!property) {
    return <div>Property not found!</div>;
  }

  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.price}</p>
    </div>
  );
}
