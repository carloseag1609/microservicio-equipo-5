import { Router } from "express";
import prisma from "./db/client.js";

const router = Router();

router.get("/detalle/:ticketId", async (req, res) => {
  const { ticketId } = req.params;
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: parseInt(ticketId),
    },
    include: {
      detalles: true,
      tienda: {
        select: {
          nombre: true,
        },
      },
    },
  });
  res.json(ticket);
});

router.post("/detalle/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { idProducto, cantidad, precio } = req.body;
    if (!idProducto || !cantidad || !precio) {
      return res.status(400).json({ message: "Faltan datos" });
    }
    await prisma.detalleTicket.create({
      data: {
        ticket: {
          connect: {
            id: parseInt(ticketId),
          },
        },
        idProducto: parseInt(idProducto),
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
      },
    });
    return res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
    });
  }
});

router.put("/detalle/:detalleId", async (req, res) => {
  try {
    const { detalleId } = req.params;
    const { idProducto, cantidad, precio } = req.body;
    await prisma.detalleTicket.update({
      where: {
        id: parseInt(detalleId),
      },
      data: {
        idProducto: parseInt(idProducto),
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
      },
    });
    return res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
    });
  }
});

router.delete("/detalle/:detalleId", async (req, res) => {
  try {
    const { detalleId } = req.params;
    await prisma.detalleTicket.delete({
      where: {
        id: parseInt(detalleId),
      },
    });
    return res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
    });
  }
});

export default router;
