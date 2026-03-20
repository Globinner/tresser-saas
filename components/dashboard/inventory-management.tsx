"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  Plus, 
  Search,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  FolderPlus,
  Edit,
  Trash2,
  Box,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  description: string | null
}

interface InventoryItem {
  id: string
  name: string
  description: string | null
  sku: string | null
  brand: string | null
  category_id: string | null
  quantity_in_stock: number
  unit: string | null
  reorder_level: number | null
  cost_per_unit: number | null
  sell_price: number | null
  supplier: string | null
  inventory_categories?: { name: string } | null
}

interface Transaction {
  id: string
  item_id: string
  transaction_type: "stock_in" | "stock_out" | "adjustment"
  quantity: number
  notes: string | null
  created_at: string
  inventory_items?: { name: string } | null
}

export function InventoryManagement({ shopId }: { shopId: string }) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  const [isItemOpen, setIsItemOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isStockOpen, setIsStockOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    sku: "",
    brand: "",
    category_id: "",
    quantity_in_stock: 0,
    unit: "units",
    reorder_level: 5,
    cost_per_unit: "",
    sell_price: "",
    supplier: ""
  })
  
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [stockAdjustment, setStockAdjustment] = useState({
    type: "stock_in" as "stock_in" | "stock_out",
    quantity: 1,
    notes: ""
  })

  useEffect(() => {
    loadData()
  }, [shopId])

  async function loadData() {
    const supabase = createClient()
    
    const [itemsRes, categoriesRes, transactionsRes] = await Promise.all([
      supabase
        .from("inventory_items")
        .select("*, inventory_categories(name)")
        .eq("shop_id", shopId)
        .order("name"),
      supabase
        .from("inventory_categories")
        .select("*")
        .eq("shop_id", shopId)
        .order("name"),
      supabase
        .from("inventory_transactions")
        .select("*, inventory_items(name)")
        .eq("shop_id", shopId)
        .order("created_at", { ascending: false })
        .limit(20)
    ])

    setItems(itemsRes.data || [])
    setCategories(categoriesRes.data || [])
    setTransactions(transactionsRes.data || [])
    setLoading(false)
  }

  async function saveItem() {
    const supabase = createClient()
    
    const itemData = {
      shop_id: shopId,
      name: newItem.name,
      description: newItem.description || null,
      sku: newItem.sku || null,
      brand: newItem.brand || null,
      category_id: newItem.category_id || null,
      quantity_in_stock: newItem.quantity_in_stock,
      unit: newItem.unit || "units",
      reorder_level: newItem.reorder_level,
      cost_per_unit: newItem.cost_per_unit ? parseFloat(newItem.cost_per_unit) : null,
      sell_price: newItem.sell_price ? parseFloat(newItem.sell_price) : null,
      supplier: newItem.supplier || null
    }

    if (editingItem) {
      await supabase
        .from("inventory_items")
        .update(itemData)
        .eq("id", editingItem.id)
    } else {
      await supabase
        .from("inventory_items")
        .insert(itemData)
    }

    setIsItemOpen(false)
    setEditingItem(null)
    setNewItem({
      name: "",
      description: "",
      sku: "",
      brand: "",
      category_id: "",
      quantity_in_stock: 0,
      unit: "units",
      reorder_level: 5,
      cost_per_unit: "",
      sell_price: "",
      supplier: ""
    })
    loadData()
  }

  async function deleteItem(itemId: string) {
    const supabase = createClient()
    await supabase.from("inventory_items").delete().eq("id", itemId)
    loadData()
  }

  async function saveCategory() {
    if (!newCategory.name) return
    const supabase = createClient()
    
    await supabase.from("inventory_categories").insert({
      shop_id: shopId,
      name: newCategory.name,
      description: newCategory.description || null
    })

    setIsCategoryOpen(false)
    setNewCategory({ name: "", description: "" })
    loadData()
  }

  async function adjustStock() {
    if (!selectedItem) return
    const supabase = createClient()
    
    const quantityChange = stockAdjustment.type === "stock_in" 
      ? stockAdjustment.quantity 
      : -stockAdjustment.quantity

    // Update item quantity
    await supabase
      .from("inventory_items")
      .update({ quantity_in_stock: selectedItem.quantity_in_stock + quantityChange })
      .eq("id", selectedItem.id)

    // Record transaction
    await supabase.from("inventory_transactions").insert({
      shop_id: shopId,
      item_id: selectedItem.id,
      transaction_type: stockAdjustment.type,
      quantity: stockAdjustment.quantity,
      notes: stockAdjustment.notes || null
    })

    setIsStockOpen(false)
    setSelectedItem(null)
    setStockAdjustment({ type: "stock_in", quantity: 1, notes: "" })
    loadData()
  }

  function openEditItem(item: InventoryItem) {
    setEditingItem(item)
    setNewItem({
      name: item.name,
      description: item.description || "",
      sku: item.sku || "",
      brand: item.brand || "",
      category_id: item.category_id || "",
      quantity_in_stock: item.quantity_in_stock,
      unit: item.unit || "units",
      reorder_level: item.reorder_level || 5,
      cost_per_unit: item.cost_per_unit?.toString() || "",
      sell_price: item.sell_price?.toString() || "",
      supplier: item.supplier || ""
    })
    setIsItemOpen(true)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || item.category_id === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockItems = items.filter(item => item.quantity_in_stock <= (item.reorder_level || 5))
  const totalValue = items.reduce((sum, item) => sum + (item.quantity_in_stock * (item.cost_per_unit || 0)), 0)

  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-muted-foreground">Loading inventory...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Box className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{items.reduce((sum, i) => sum + i.quantity_in_stock, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Units</p>
            </div>
          </CardContent>
        </Card>
        <Card className={cn("glass", lowStockItems.length > 0 && "border-red-500/50")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{lowStockItems.length}</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalValue.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="glass border-red-500/50 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <Badge key={item.id} variant="outline" className="border-red-500/50 text-red-400">
                  {item.name} ({item.quantity_in_stock} {item.unit || "units"})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="products" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Category
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-strong">
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Category Name *</Label>
                    <Input
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="e.g., Hair Products"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Optional description..."
                      className="bg-secondary/50"
                    />
                  </div>
                  <Button onClick={saveCategory} className="w-full" disabled={!newCategory.name}>
                    Add Category
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isItemOpen} onOpenChange={(open) => {
              setIsItemOpen(open)
              if (!open) {
                setEditingItem(null)
                setNewItem({
                  name: "",
                  description: "",
                  sku: "",
                  brand: "",
                  category_id: "",
                  quantity_in_stock: 0,
                  unit: "units",
                  reorder_level: 5,
                  cost_per_unit: "",
                  sell_price: "",
                  supplier: ""
                })
              }
            }}>
              <DialogTrigger asChild>
                <Button className="glow-amber-soft">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-strong max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Product" : "Add Product"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Product Name *</Label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="e.g., Pomade Wax"
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                        placeholder="e.g., PMD-001"
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Brand</Label>
                      <Input
                        value={newItem.brand}
                        onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                        placeholder="e.g., Layrite"
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select 
                        value={newItem.category_id} 
                        onValueChange={(v) => setNewItem({ ...newItem, category_id: v })}
                      >
                        <SelectTrigger className="bg-secondary/50">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity in Stock</Label>
                      <Input
                        type="number"
                        min={0}
                        value={newItem.quantity_in_stock}
                        onChange={(e) => setNewItem({ ...newItem, quantity_in_stock: parseInt(e.target.value) || 0 })}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select 
                        value={newItem.unit} 
                        onValueChange={(v) => setNewItem({ ...newItem, unit: v })}
                      >
                        <SelectTrigger className="bg-secondary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="units">Units</SelectItem>
                          <SelectItem value="bottles">Bottles</SelectItem>
                          <SelectItem value="tubes">Tubes</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                          <SelectItem value="oz">Ounces</SelectItem>
                          <SelectItem value="ml">Milliliters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Reorder Level</Label>
                      <Input
                        type="number"
                        min={0}
                        value={newItem.reorder_level}
                        onChange={(e) => setNewItem({ ...newItem, reorder_level: parseInt(e.target.value) || 0 })}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cost per Unit ($)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={newItem.cost_per_unit}
                        onChange={(e) => setNewItem({ ...newItem, cost_per_unit: e.target.value })}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sell Price ($)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={newItem.sell_price}
                        onChange={(e) => setNewItem({ ...newItem, sell_price: e.target.value })}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Supplier</Label>
                      <Input
                        value={newItem.supplier}
                        onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                        placeholder="e.g., Beauty Supply Co."
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Product description..."
                        className="bg-secondary/50"
                      />
                    </div>
                  </div>
                  <Button onClick={saveItem} className="w-full" disabled={!newItem.name}>
                    {editingItem ? "Update Product" : "Add Product"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="products">
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-secondary/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {filteredItems.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No products found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <Card 
                  key={item.id} 
                  className={cn(
                    "glass hover:border-primary/30 transition-colors",
                    item.quantity <= item.min_stock_level && "border-red-500/50"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        {item.sku && (
                          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={cn(
                          "text-2xl font-bold",
                          item.quantity_in_stock <= (item.reorder_level || 5) ? "text-red-400" : "text-foreground"
                        )}>
                          {item.quantity_in_stock}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.unit || "units"}</p>
                      </div>
                      {item.inventory_categories?.name && (
                        <Badge variant="outline">{item.inventory_categories.name}</Badge>
                      )}
                    </div>

                    {item.quantity_in_stock <= (item.reorder_level || 5) && (
                      <div className="flex items-center gap-1 text-xs text-red-400 mb-3">
                        <AlertTriangle className="w-3 h-3" />
                        Below reorder level ({item.reorder_level || 5})
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedItem(item)
                          setStockAdjustment({ type: "stock_out", quantity: 1, notes: "" })
                          setIsStockOpen(true)
                        }}
                      >
                        <Minus className="w-4 h-4 mr-1" />
                        Out
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary"
                        onClick={() => {
                          setSelectedItem(item)
                          setStockAdjustment({ type: "stock_in", quantity: 1, notes: "" })
                          setIsStockOpen(true)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        In
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map(tx => (
                    <div 
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          tx.transaction_type === "stock_in" 
                            ? "bg-green-500/20" 
                            : "bg-red-500/20"
                        )}>
                          {tx.transaction_type === "stock_in" ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.inventory_items?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-bold",
                          tx.transaction_type === "stock_in" ? "text-green-400" : "text-red-400"
                        )}>
                          {tx.transaction_type === "stock_in" ? "+" : "-"}{tx.quantity}
                        </p>
                        {tx.notes && (
                          <p className="text-xs text-muted-foreground">{tx.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Modal */}
      <Dialog open={isStockOpen} onOpenChange={setIsStockOpen}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle>
              {stockAdjustment.type === "stock_in" ? "Stock In" : "Stock Out"}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                value={stockAdjustment.quantity}
                onChange={(e) => setStockAdjustment({ 
                  ...stockAdjustment, 
                  quantity: parseInt(e.target.value) || 1 
                })}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={stockAdjustment.notes}
                onChange={(e) => setStockAdjustment({ ...stockAdjustment, notes: e.target.value })}
                placeholder="e.g., Restocked from supplier"
                className="bg-secondary/50"
              />
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Current stock: <span className="font-medium text-foreground">{selectedItem?.quantity}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                After adjustment: <span className={cn(
                  "font-medium",
                  stockAdjustment.type === "stock_in" ? "text-green-400" : "text-red-400"
                )}>
                  {selectedItem ? (
                    stockAdjustment.type === "stock_in"
                      ? selectedItem.quantity + stockAdjustment.quantity
                      : selectedItem.quantity - stockAdjustment.quantity
                  ) : 0}
                </span>
              </p>
            </div>
            <Button onClick={adjustStock} className="w-full">
              Confirm {stockAdjustment.type === "stock_in" ? "Stock In" : "Stock Out"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
