import * as RadixAlertDialog from '@radix-ui/react-alert-dialog'
import clsx from 'clsx'
import { forwardRef } from 'react'

import css from './AlertDialog.module.scss'

import type {
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogTitleProps,
  AlertDialogCancelProps,
} from '@radix-ui/react-alert-dialog'

const AlertDialog = {
  Root: RadixAlertDialog.Root,
  Trigger: RadixAlertDialog.Trigger,
  Portal: RadixAlertDialog.Portal,
  Overlay: forwardRef<HTMLDivElement, AlertDialogOverlayProps>(({ className, ...props }, ref) => (
    <RadixAlertDialog.Overlay {...props} ref={ref} className={clsx(css.overlay, className)} />
  )),
  Content: forwardRef<HTMLDivElement, AlertDialogContentProps>(({ className, ...props }, ref) => (
    <RadixAlertDialog.Content {...props} ref={ref} className={clsx(css.content, className)} />
  )),
  Title: forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(({ className, ...props }, ref) => (
    <RadixAlertDialog.Title {...props} ref={ref} className={clsx(css.title, className)} />
  )),
  Description: RadixAlertDialog.Description,
  Cancel: forwardRef<HTMLButtonElement, AlertDialogCancelProps>(({ className, ...props }, ref) => (
    <RadixAlertDialog.Cancel {...props} ref={ref} className={clsx(css.cancel, className)} />
  )),
  Action: RadixAlertDialog.Action,
}

export default AlertDialog
