"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

// Helper function to process and save uploaded files
async function saveFilesAndGetImages(formData: FormData): Promise<{url: string, title: string}[]> {
  const files = formData.getAll("images") as File[];
  const titles = formData.getAll("imageTitles") as string[];
  const uploadedImages: {url: string, title: string}[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > 0 && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      
      const filepath = path.join(process.cwd(), "public/uploads", filename);
      await writeFile(filepath, buffer);
      
      uploadedImages.push({ 
        url: `/uploads/${filename}`, 
        title: titles[i] || `Image ${i+1}` 
      });
    }
  }
  
  return uploadedImages;
}

export async function getVillas() {
  try {
    const villas = await prisma.villa.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: true }
    });
    return { success: true, data: villas };
  } catch (error) {
    console.error("Failed to fetch villas:", error);
    return { success: false, error: "Gagal mengambil data villa" };
  }
}

export async function deleteVilla(id: string) {
  try {
    await prisma.villa.delete({
      where: { id },
    });
    
    revalidatePath("/admin/villas");
    revalidatePath("/villas");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete villa:", error);
    return { success: false, error: "Gagal menghapus villa" };
  }
}

export async function createVilla(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const capacity = parseInt(formData.get("capacity") as string);
    
    if (!name || !description || !price || !capacity) {
      return { success: false, error: "Semua field harus diisi" };
    }

    const uploadedImages = await saveFilesAndGetImages(formData);

    await prisma.villa.create({
      data: {
        name,
        description,
        price,
        capacity,
        images: {
          create: uploadedImages
        }
      }
    });

    revalidatePath("/admin/villas");
    revalidatePath("/villas");
    return { success: true };
  } catch (error) {
    console.error("Failed to create villa:", error);
    return { success: false, error: "Gagal membuat villa" };
  }
}

export async function updateVilla(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const capacity = parseInt(formData.get("capacity") as string);
    
    if (!name || !description || !price || !capacity) {
      return { success: false, error: "Semua field harus diisi" };
    }

    const newUploadedImages = await saveFilesAndGetImages(formData);

    await prisma.villa.update({
      where: { id },
      data: {
        name,
        description,
        price,
        capacity,
        images: {
          create: newUploadedImages
        }
      }
    });

    revalidatePath("/admin/villas");
    revalidatePath("/villas");
    return { success: true };
  } catch (error) {
    console.error("Failed to update villa:", error);
    return { success: false, error: "Gagal mengupdate villa" };
  }
}
