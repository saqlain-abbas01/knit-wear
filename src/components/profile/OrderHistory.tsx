"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/api/order";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface OrderHistoryProps {
  user: any;
}

export default function OrderHistory({ user }: OrderHistoryProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(user.id),
  });
  if (isLoading) return <div>loading orders please wait..</div>;
  if (error)
    return <div>Error while fecthing orders please try again later</div>;
  console.log("data orders", data);
  const orders = data.order;
  console.log("orders", orders);
  if (orders?.length === 0) {
    return (
      <div className="bg-muted p-8 rounded-lg text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet.
        </p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {orders?.map((order: any) => (
          <div key={order.id} className="bg-muted/30 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {/* <h3 className="font-medium">Order #{order.orderNumber}</h3> */}
                  <Badge
                    variant={getStatusVariant(order.status)}
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setOpenDialog(true);
                  }}
                  className="flex items-center gap-1"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {order.items.slice(0, 2).map((item: any) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {order.items.length > 2 && (
                <p className="text-sm text-muted-foreground">
                  + {order.items.length - 2} more item
                  {order.items.length - 2 > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="lg:max-w-lg md:max-w-md sm:max-w-sm max-w-xs">
          {selectedOrder && (
            <div className="space-y-4 text-left">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription className="text-left">
                  Order ID: {selectedOrder.id} <br />
                  Placed on:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}{" "}
                  <br />
                  Status:{" "}
                  <Badge
                    variant={getStatusVariant(selectedOrder.status)}
                    className="capitalize"
                  >
                    {selectedOrder.status}
                  </Badge>{" "}
                  <br />
                  Payment: {selectedOrder.paymentMethod} <br />
                  Total: ${selectedOrder.totalAmount.toFixed(2)} <br />
                </DialogDescription>
              </DialogHeader>

              <Separator />

              <div className="space-y-3">
                {selectedOrder.items.map((item: any) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 items-center"
                  >
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "processing":
      return "default";
    case "shipped":
      return "secondary";
    case "delivered":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
}
