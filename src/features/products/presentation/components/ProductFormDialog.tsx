import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, type ProductFormValues } from '@/features/products/presentation/schemas/product-form'
import { useProductCreate, useProductUpdate } from '@/features/products/presentation/hooks/useProductFeature'
import { useCategoriesList } from '@/features/categories/presentation/hooks/useCategoryFeature'
import { useSuppliersList } from '@/features/suppliers/presentation/hooks/useSupplierFeature'
import { Button } from '@/shared/presentation/components/ui/button'
import { Input } from '@/shared/presentation/components/ui/input'
import { Textarea } from '@/shared/presentation/components/ui/textarea'
import { FormField } from '@/shared/presentation/components/FormField'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/presentation/components/ui/select'
import { useToast } from '@/shared/presentation/components/ui/toast'
import { getErrorMessage } from '@/shared/infrastructure/http/problem-details'
import { UNIT_LABELS } from '@/shared/domain/models'
import type { Product } from '@/shared/domain/models'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody,
} from '@/shared/presentation/components/ui/dialog'

interface Props { open: boolean; onClose: () => void; product: Product | null }

export function ProductFormDialog({ open, onClose, product }: Props) {
  const { toast } = useToast()
  const createMut = useProductCreate()
  const updateMut = useProductUpdate()
  const { data: categories } = useCategoriesList({ page: 0, size: 100, sort: 'name,asc' })
  const { data: suppliers } = useSuppliersList({ page: 0, size: 100, sort: 'name,asc' })

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    if (product) {
      reset({
        sku: product.sku, name: product.name, description: product.description,
        categoryId: product.category.id, supplierId: product.supplier?.id ?? null,
        unit: product.unit, purchasePrice: product.purchasePrice, salePrice: product.salePrice,
        minimumStock: product.minimumStock,
      })
    } else {
      reset({ sku: '', name: '', description: null, unit: 'PIECE', purchasePrice: '', salePrice: '', minimumStock: 0 })
    }
  }, [product, reset])

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (product) await updateMut.mutateAsync({ id: product.id, input: values })
      else await createMut.mutateAsync(values)
      toast(product ? 'Produit modifié.' : 'Produit créé.', 'success')
      onClose()
    } catch (err) {
      toast(getErrorMessage((err as { code?: string }).code ?? 'INTERNAL_ERROR'), 'error')
    }
  }

  const loading = createMut.isPending || updateMut.isPending

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Modifier le produit' : 'Nouveau produit'}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="SKU" htmlFor="p-sku" required error={errors.sku?.message} hint="Lettres majuscules, chiffres, tirets.">
                <Input id="p-sku" {...register('sku')} error={!!errors.sku} placeholder="EX-SKU-001" disabled={!!product} />
              </FormField>
              <FormField label="Unité" htmlFor="p-unit" required error={errors.unit?.message}>
                <Controller control={control} name="unit" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger error={!!errors.unit}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(UNIT_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </FormField>
            </div>
            <FormField label="Nom du produit" htmlFor="p-name" required error={errors.name?.message}>
              <Input id="p-name" {...register('name')} error={!!errors.name} placeholder="ex: Laptop Dell Latitude 5520" />
            </FormField>
            <FormField label="Description" htmlFor="p-desc" error={errors.description?.message}>
              <Textarea id="p-desc" {...register('description')} placeholder="Description optionnelle..." rows={2} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Catégorie" required error={errors.categoryId?.message}>
                <Controller control={control} name="categoryId" render={({ field }) => (
                  <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                    <SelectTrigger error={!!errors.categoryId}><SelectValue placeholder="Choisir..." /></SelectTrigger>
                    <SelectContent>
                      {categories?.content.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </FormField>
              <FormField label="Fournisseur" error={errors.supplierId?.message}>
                <Controller control={control} name="supplierId" render={({ field }) => (
                  <Select value={field.value ? String(field.value) : 'none'} onValueChange={(v) => field.onChange(v === 'none' ? null : Number(v))}>
                    <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      {suppliers?.content.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </FormField>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Prix d'achat (XAF)" htmlFor="p-purchase" required error={errors.purchasePrice?.message}>
                <Input id="p-purchase" {...register('purchasePrice')} error={!!errors.purchasePrice} placeholder="450000" />
              </FormField>
              <FormField label="Prix de vente (XAF)" htmlFor="p-sale" required error={errors.salePrice?.message}>
                <Input id="p-sale" {...register('salePrice')} error={!!errors.salePrice} placeholder="580000" />
              </FormField>
              <FormField label="Stock minimum" htmlFor="p-minstock" required error={errors.minimumStock?.message}>
                <Input id="p-minstock" type="number" min={0} {...register('minimumStock', { valueAsNumber: true })} error={!!errors.minimumStock} />
              </FormField>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Annuler</Button>
          <Button type="submit" form="product-form" loading={loading}>{product ? 'Enregistrer' : 'Créer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
