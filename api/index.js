// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// src/routes/auth.routes.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt2 from "jsonwebtoken";

// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
var prisma_default = prisma;

// src/middleware/auth.ts
import jwt from "jsonwebtoken";
var authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token tidak ditemukan" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token tidak valid" });
  }
};
var requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Akses ditolak. Hanya admin yang bisa mengakses." });
    return;
  }
  next();
};

// src/routes/auth.routes.ts
var router = Router();
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, dan nama wajib diisi" });
      return;
    }
    const existing = await prisma_default.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: "Email sudah terdaftar" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma_default.user.create({
      data: { email, password: hashedPassword, name, role: "USER" }
    });
    const token = jwt2.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Gagal mendaftar" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email dan password wajib diisi" });
      return;
    }
    const user = await prisma_default.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Email atau password salah" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Email atau password salah" });
      return;
    }
    const token = jwt2.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Gagal login" });
  }
});
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma_default.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    if (!user) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ error: "Gagal mengambil data user" });
  }
});
var auth_routes_default = router;

// src/routes/product.routes.ts
import { Router as Router2 } from "express";
var router2 = Router2();
function normalizeEthicalBadges(input) {
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
    } catch {
    }
    return input.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}
router2.get("/", async (_req, res) => {
  try {
    const products = await prisma_default.product.findMany({
      include: {
        artisan: true,
        supplySteps: { orderBy: { sortOrder: "asc" } },
        reviews: { include: { user: { select: { id: true, name: true } } } }
      }
    });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Gagal mengambil data produk" });
  }
});
router2.get("/:id", async (req, res) => {
  try {
    const product = await prisma_default.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        artisan: true,
        supplySteps: { orderBy: { sortOrder: "asc" } },
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    if (!product) {
      res.status(404).json({ error: "Produk tidak ditemukan" });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Gagal mengambil data produk" });
  }
});
router2.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, category, imageUrl, umkm, umkmStory, village, culturalValue, ethicalBadges, artisanId, supplySteps } = req.body;
    const product = await prisma_default.product.create({
      data: {
        name,
        description,
        category,
        imageUrl,
        umkm,
        umkmStory,
        village,
        culturalValue,
        ethicalBadges: normalizeEthicalBadges(ethicalBadges),
        artisanId: parseInt(artisanId),
        supplySteps: supplySteps ? {
          create: supplySteps.map((s, i) => ({
            title: s.title,
            actor: s.actor,
            location: s.location,
            description: s.description,
            icon: s.icon || "",
            imageUrl: s.imageUrl,
            sortOrder: i
          }))
        } : void 0
      },
      include: { artisan: true, supplySteps: true }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Gagal membuat produk" });
  }
});
router2.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, category, imageUrl, umkm, umkmStory, village, culturalValue, ethicalBadges, artisanId } = req.body;
    const product = await prisma_default.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        imageUrl,
        umkm,
        umkmStory,
        village,
        culturalValue,
        ethicalBadges: ethicalBadges ? normalizeEthicalBadges(ethicalBadges) : void 0,
        artisanId: artisanId ? parseInt(artisanId) : void 0,
        supplySteps: req.body.supplySteps ? {
          deleteMany: {},
          create: req.body.supplySteps.map((s, i) => ({
            title: s.title,
            actor: s.actor,
            location: s.location,
            description: s.description,
            icon: s.icon || "",
            imageUrl: s.imageUrl,
            sortOrder: i
          }))
        } : void 0
      },
      include: { artisan: true, supplySteps: true }
    });
    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Gagal mengupdate produk" });
  }
});
router2.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma_default.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Gagal menghapus produk" });
  }
});
var product_routes_default = router2;

// src/routes/artisan.routes.ts
import { Router as Router3 } from "express";
var router3 = Router3();
router3.get("/", async (_req, res) => {
  try {
    const artisans = await prisma_default.artisan.findMany({
      include: { products: { select: { id: true, name: true, category: true, imageUrl: true } } }
    });
    res.json(artisans);
  } catch (error) {
    console.error("Get artisans error:", error);
    res.status(500).json({ error: "Gagal mengambil data artisan" });
  }
});
router3.get("/:id", async (req, res) => {
  try {
    const artisan = await prisma_default.artisan.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { products: true }
    });
    if (!artisan) {
      res.status(404).json({ error: "Artisan tidak ditemukan" });
      return;
    }
    res.json(artisan);
  } catch (error) {
    console.error("Get artisan error:", error);
    res.status(500).json({ error: "Gagal mengambil data artisan" });
  }
});
router3.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const artisan = await prisma_default.artisan.create({ data: req.body });
    res.status(201).json(artisan);
  } catch (error) {
    console.error("Create artisan error:", error);
    res.status(500).json({ error: "Gagal membuat artisan" });
  }
});
router3.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const artisan = await prisma_default.artisan.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(artisan);
  } catch (error) {
    console.error("Update artisan error:", error);
    res.status(500).json({ error: "Gagal mengupdate artisan" });
  }
});
router3.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma_default.artisan.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Artisan berhasil dihapus" });
  } catch (error) {
    console.error("Delete artisan error:", error);
    res.status(500).json({ error: "Gagal menghapus artisan" });
  }
});
var artisan_routes_default = router3;

// src/routes/review.routes.ts
import { Router as Router4 } from "express";
var router4 = Router4();
router4.get("/featured", async (_req, res) => {
  try {
    const reviews = await prisma_default.review.findMany({
      where: { rating: { gte: 4 } },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 6
    });
    res.json(reviews);
  } catch (error) {
    console.error("Get featured reviews error:", error);
    res.status(500).json({ error: "Gagal mengambil data featured review" });
  }
});
router4.get("/", async (req, res) => {
  try {
    const { productId } = req.query;
    const where = productId ? { productId: parseInt(productId) } : {};
    const reviews = await prisma_default.review.findMany({
      where,
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ error: "Gagal mengambil data review" });
  }
});
router4.post("/", authenticate, async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    if (!rating || !comment || !productId) {
      res.status(400).json({ error: "Rating, komentar, dan productId wajib diisi" });
      return;
    }
    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating harus antara 1-5" });
      return;
    }
    const existing = await prisma_default.review.findFirst({
      where: { userId: req.user.id, productId: parseInt(productId) }
    });
    if (existing) {
      res.status(400).json({ error: "Anda sudah memberikan review untuk produk ini" });
      return;
    }
    const review = await prisma_default.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        userId: req.user.id,
        productId: parseInt(productId)
      },
      include: { user: { select: { id: true, name: true } } }
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: "Gagal membuat review" });
  }
});
router4.put("/:id", authenticate, async (req, res) => {
  try {
    const review = await prisma_default.review.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!review) {
      res.status(404).json({ error: "Review tidak ditemukan" });
      return;
    }
    if (review.userId !== req.user.id) {
      res.status(403).json({ error: "Anda hanya bisa mengedit review milik sendiri" });
      return;
    }
    const { rating, comment } = req.body;
    if (!rating || !comment?.trim()) {
      res.status(400).json({ error: "Rating dan komentar wajib diisi" });
      return;
    }
    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating harus antara 1-5" });
      return;
    }
    const updated = await prisma_default.review.update({
      where: { id: review.id },
      data: { rating: parseInt(rating), comment: comment.trim() },
      include: { user: { select: { id: true, name: true } } }
    });
    res.json(updated);
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ error: "Gagal mengupdate review" });
  }
});
router4.delete("/:id", authenticate, async (req, res) => {
  try {
    const review = await prisma_default.review.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!review) {
      res.status(404).json({ error: "Review tidak ditemukan" });
      return;
    }
    if (review.userId !== req.user.id && req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Tidak memiliki akses" });
      return;
    }
    await prisma_default.review.delete({ where: { id: review.id } });
    res.json({ message: "Review berhasil dihapus" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: "Gagal menghapus review" });
  }
});
var review_routes_default = router4;

// src/routes/region.routes.ts
import { Router as Router5 } from "express";
var router5 = Router5();
router5.get("/", async (_req, res) => {
  try {
    const regions = await prisma_default.region.findMany({
      include: { products: true }
    });
    res.json(regions);
  } catch (error) {
    console.error("Get regions error:", error);
    res.status(500).json({ error: "Gagal mengambil data wilayah" });
  }
});
router5.get("/:id", async (req, res) => {
  try {
    const region = await prisma_default.region.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { products: true }
    });
    if (!region) {
      res.status(404).json({ error: "Wilayah tidak ditemukan" });
      return;
    }
    res.json(region);
  } catch (error) {
    console.error("Get region error:", error);
    res.status(500).json({ error: "Gagal mengambil data wilayah" });
  }
});
router5.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, emoji, description, products } = req.body;
    const region = await prisma_default.region.create({
      data: {
        name,
        emoji,
        description,
        products: products ? { create: products } : void 0
      },
      include: { products: true }
    });
    res.status(201).json(region);
  } catch (error) {
    console.error("Create region error:", error);
    res.status(500).json({ error: "Gagal membuat wilayah" });
  }
});
router5.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, emoji, description } = req.body;
    const region = await prisma_default.region.update({
      where: { id: parseInt(req.params.id) },
      data: { name, emoji, description },
      include: { products: true }
    });
    res.json(region);
  } catch (error) {
    console.error("Update region error:", error);
    res.status(500).json({ error: "Gagal mengupdate wilayah" });
  }
});
router5.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma_default.region.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Wilayah berhasil dihapus" });
  } catch (error) {
    console.error("Delete region error:", error);
    res.status(500).json({ error: "Gagal menghapus wilayah" });
  }
});
var region_routes_default = router5;

// src/routes/team.routes.ts
import { Router as Router6 } from "express";
var router6 = Router6();
router6.get("/", async (_req, res) => {
  try {
    const members = await prisma_default.teamMember.findMany();
    res.json(members);
  } catch (error) {
    console.error("Get team error:", error);
    res.status(500).json({ error: "Gagal mengambil data tim" });
  }
});
router6.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.expertise === "string") {
      try {
        data.expertise = JSON.parse(data.expertise);
      } catch {
        data.expertise = data.expertise.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    if (data.expertise !== void 0 && !Array.isArray(data.expertise)) data.expertise = [];
    const member = await prisma_default.teamMember.create({ data });
    res.status(201).json(member);
  } catch (error) {
    console.error("Create team member error:", error);
    res.status(500).json({ error: "Gagal menambah anggota tim" });
  }
});
router6.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.expertise === "string") {
      try {
        data.expertise = JSON.parse(data.expertise);
      } catch {
        data.expertise = data.expertise.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    if (data.expertise !== void 0 && !Array.isArray(data.expertise)) data.expertise = [];
    const member = await prisma_default.teamMember.update({
      where: { id: parseInt(req.params.id) },
      data
    });
    res.json(member);
  } catch (error) {
    console.error("Update team member error:", error);
    res.status(500).json({ error: "Gagal mengupdate anggota tim" });
  }
});
router6.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma_default.teamMember.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Anggota tim berhasil dihapus" });
  } catch (error) {
    console.error("Delete team member error:", error);
    res.status(500).json({ error: "Gagal menghapus anggota tim" });
  }
});
var team_routes_default = router6;

// src/routes/quiz.routes.ts
import { Router as Router7 } from "express";
var router7 = Router7();
router7.get("/", async (_req, res) => {
  try {
    const questions = await prisma_default.quizQuestion.findMany();
    res.json(questions);
  } catch (error) {
    console.error("Get quiz error:", error);
    res.status(500).json({ error: "Gagal mengambil data kuis" });
  }
});
router7.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const data = { ...req.body };
    const question = await prisma_default.quizQuestion.create({ data });
    res.status(201).json(question);
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ error: "Gagal membuat kuis" });
  }
});
router7.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const data = { ...req.body };
    const question = await prisma_default.quizQuestion.update({
      where: { id: parseInt(req.params.id) },
      data
    });
    res.json(question);
  } catch (error) {
    console.error("Update quiz error:", error);
    res.status(500).json({ error: "Gagal mengupdate kuis" });
  }
});
router7.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma_default.quizQuestion.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Kuis berhasil dihapus" });
  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ error: "Gagal menghapus kuis" });
  }
});
var quiz_routes_default = router7;

// src/routes/dashboard.routes.ts
import { Router as Router8 } from "express";
var router8 = Router8();
router8.get("/stats", authenticate, requireAdmin, async (_req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalArtisans,
      totalReviews,
      totalRegions,
      totalTeamMembers,
      totalQuizQuestions,
      recentReviews,
      recentUsers
    ] = await Promise.all([
      prisma_default.user.count(),
      prisma_default.product.count(),
      prisma_default.artisan.count(),
      prisma_default.review.count(),
      prisma_default.region.count(),
      prisma_default.teamMember.count(),
      prisma_default.quizQuestion.count(),
      prisma_default.review.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          product: { select: { name: true } }
        }
      }),
      prisma_default.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      })
    ]);
    const avgRating = await prisma_default.review.aggregate({ _avg: { rating: true } });
    const products = await prisma_default.product.findMany({ select: { category: true } });
    const categoryCounts = {};
    products.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalArtisans,
        totalReviews,
        totalRegions,
        totalTeamMembers,
        totalQuizQuestions,
        averageRating: avgRating._avg.rating || 0
      },
      categoryCounts,
      recentReviews,
      recentUsers
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Gagal mengambil statistik dashboard" });
  }
});
var dashboard_routes_default = router8;

// src/routes/upload.routes.ts
import { Router as Router9 } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import path from "path";
var router9 = Router9();
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  // 4MB max (Vercel limit ~4.5MB)
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar (JPEG, PNG, WebP, GIF) yang diizinkan"));
    }
  }
});
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL dan SUPABASE_SERVICE_KEY harus diset di .env");
  }
  return createClient(url, key);
}
router9.post("/", authenticate, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Tidak ada file yang diupload" });
      return;
    }
    const supabase = getSupabase();
    const ext = path.extname(req.file.originalname) || ".jpg";
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    const filePath = `images/${filename}`;
    const { error: uploadError } = await supabase.storage.from("uploads").upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      cacheControl: "3600",
      upsert: false
    });
    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      res.status(500).json({ error: "Gagal mengupload file: " + uploadError.message });
      return;
    }
    const { data: publicUrlData } = supabase.storage.from("uploads").getPublicUrl(filePath);
    res.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Gagal mengupload file" });
  }
});
var upload_routes_default = router9;

// src/routes/stats.routes.ts
import { Router as Router10 } from "express";
var router10 = Router10();
router10.get("/", async (_req, res) => {
  try {
    const [
      totalProducts,
      totalArtisans,
      totalRegions,
      totalReviews,
      distinctCategories,
      avgRating
    ] = await Promise.all([
      prisma_default.product.count(),
      prisma_default.artisan.count(),
      prisma_default.region.count(),
      prisma_default.review.count(),
      prisma_default.product.findMany({
        select: { category: true },
        distinct: ["category"]
      }),
      prisma_default.review.aggregate({ _avg: { rating: true } })
    ]);
    res.json({
      totalProducts,
      totalArtisans,
      totalRegions,
      totalCategories: distinctCategories.length,
      totalReviews,
      averageRating: Math.round((avgRating._avg.rating || 0) * 10) / 10
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Gagal mengambil statistik" });
  }
});
var stats_routes_default = router10;

// src/routes/partnership.routes.ts
import { Router as Router11 } from "express";
var router11 = Router11();
router11.get("/", authenticate, requireAdmin, async (_req, res) => {
  try {
    const partnerships = await prisma_default.partnership.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(partnerships);
  } catch (error) {
    console.error("Get partnerships error:", error);
    res.status(500).json({ error: "Gagal mengambil data kemitraan" });
  }
});
router11.post("/", async (req, res) => {
  try {
    const { name, email, whatsapp, umkm, village, category, umkmStory, description, ethicalBadges, steps } = req.body;
    const partnership = await prisma_default.partnership.create({
      data: {
        name,
        email,
        whatsapp,
        umkm,
        village,
        category,
        umkmStory,
        description,
        ethicalBadges,
        steps
      }
    });
    res.status(201).json(partnership);
  } catch (error) {
    console.error("Create partnership error:", error);
    res.status(500).json({ error: "Gagal mengirim pengajuan kemitraan" });
  }
});
router11.put("/:id/status", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      res.status(400).json({ error: "Status tidak valid" });
      return;
    }
    const partnership = await prisma_default.partnership.update({
      where: { id },
      data: { status }
    });
    res.json(partnership);
  } catch (error) {
    console.error("Update partnership status error:", error);
    res.status(500).json({ error: "Gagal memperbarui status kemitraan" });
  }
});
var partnership_routes_default = router11;

// src/index.ts
dotenv.config();
var app = express();
var PORT = process.env.PORT || 3001;
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) : ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", auth_routes_default);
app.use("/api/products", product_routes_default);
app.use("/api/artisans", artisan_routes_default);
app.use("/api/reviews", review_routes_default);
app.use("/api/regions", region_routes_default);
app.use("/api/team", team_routes_default);
app.use("/api/quiz", quiz_routes_default);
app.use("/api/dashboard", dashboard_routes_default);
app.use("/api/upload", upload_routes_default);
app.use("/api/stats", stats_routes_default);
app.use("/api/partnership", partnership_routes_default);
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\u{1F680} Server running on port ${PORT}`);
  });
}
var index_default = app;

// src/vercel-entry.ts
import serverless from "serverless-http";
var vercel_entry_default = serverless(index_default);
export {
  vercel_entry_default as default
};
