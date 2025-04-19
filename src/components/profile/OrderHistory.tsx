import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Package } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-muted/30 p-8 rounded-lg text-center">
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
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-muted/30 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Order #{order.orderNumber}</h3>
                <Badge
                  variant={getStatusVariant(order.status)}
                  className="capitalize"
                >
                  {order.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium">${order.total.toFixed(2)}</p>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/profile/orders/${order.id}`}
                  className="flex items-center gap-1"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            {order.items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm">${item.price.toFixed(2)}</p>
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
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "processing":
      return "default";
    case "shipped":
      return "secondary";
    case "delivered":
      return "success";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
}
