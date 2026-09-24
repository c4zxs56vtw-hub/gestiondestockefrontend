import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supplierSchema, type SupplierFormValues } from '@/features/suppliers/presentation/schemas/supplier-schema'
import { Button } from '@/shared/presentation/components/ui/button'
import { Input } from '@/shared/presentation/components/ui/input'
import { Textarea } from '@/shared/presentation/components/ui/textarea'
import { FormField } from '@/shared/presentation/components/FormField'
import { useToast } from '@/shared/presentation/components/ui/toast'
import { getErrorMessage } from '@/shared/infrastructure/http/problem-details'
import type { Supplier } from '@/shared/domain/models'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody,
} from '@/shared/presentation/components/ui/dialog'
import type { UseMutationResult } from '@tanstack/react-query'

interface Props {
  open: boolean
  onClose: () => void
  supplier: Supplier | null
  createMut: UseMutationResult<Supplier, Error, SupplierFormValues>
  updateMut: UseMutationResult<Supplier, Error, { id: number; input: SupplierFormValues }>
}

export function SupplierFormDialog({ open, onClose, supplier, createMut, updateMut }: Props) {
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: '', contactName: null, email: null, phone: null, address: null },
  })

  useEffect(() => {
    if (supplier) reset({ name: supplier.name, contactName: supplier.contactName, email: supplier.email, phone: supplier.phone, address: supplier.address })
    else reset({ name: '', contactName: null, email: null, phone: null, address: null })
  }, [supplier, reset])

  const onSubmit = async (values: SupplierFormValues) => {
    try {
      if (supplier) await updateMut.mutateAsync({ id: supplier.id, input: values })
      else await createMut.mutateAsync(values)
      toast(supplier ? 'Fournisseur modifié.' : 'Fournisseur créé.', 'success')
      onClose()
    } catch (err) {
      toast(getErrorMessage((err as { code?: string }).code ?? 'INTERNAL_ERROR'), 'error')
    }
  }

  const loading = createMut.isPending || updateMut.isPending

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{supplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form id="sup-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Nom" htmlFor="sup-name" required error={errors.name?.message}>
              <Input id="sup-name" {...register('name')} error={!!errors.name} placeholder="ex: Tech Cameroun SARL" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Personne contact" htmlFor="sup-contact" error={errors.contactName?.message}>
                <Input id="sup-contact" {...register('contactName')} placeholder="Nom du contact" />
              </FormField>
              <FormField label="Téléphone" htmlFor="sup-phone" error={errors.phone?.message}>
                <Input id="sup-phone" {...register('phone')} placeholder="+237 6XX XXX XXX" />
              </FormField>
            </div>
            <FormField label="Email" htmlFor="sup-email" error={errors.email?.message}>
              <Input id="sup-email" type="email" {...register('email')} placeholder="contact@fournisseur.cm" />
            </FormField>
            <FormField label="Adresse" htmlFor="sup-addr" error={errors.address?.message}>
              <Textarea id="sup-addr" {...register('address')} placeholder="Adresse complète..." rows={2} />
            </FormField>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Annuler</Button>
          <Button type="submit" form="sup-form" loading={loading}>{supplier ? 'Enregistrer' : 'Créer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
