export type Plan = 'Starter' | 'Pro' | 'Label' | 'DittoPlusRLS'
export type ServiceStatus = 'available' | 'active' | 'unavailable'
export type ModalStep = 'select' | 'add' | 'upgrade'

export interface LabelOption {
  name: string
  isBeatportLabel: boolean
}

// Royalty Splits Types
export type UserType = 'subscription' | 'rls'
// 'verification' is a gate rather than a resting state: a split added from an
// unrecognised device waits here until the account holder verifies it, and only then
// becomes active (Ditto+ RLS) or pending (subscription).
export type SplitStatus = 'active' | 'pending' | 'rejected' | 'unclaimed' | 'verification'

export interface Collaborator {
  id: string
  name: string
  email: string
  share: number
  status: SplitStatus
  activeSince?: string
  originalShare?: number // The share value before editing (for showing pending changes)
  hasAccount?: boolean // Whether the collaborator has a Ditto account (for subscription mode)
}

export interface TrackSplit {
  trackId: string
  trackNumber: number
  trackName: string
  splits: Collaborator[]
  userShare: number
}

export interface Release {
  id: string
  title: string
  artwork: string
  accountHolder: string
  tracks: TrackSplit[]
}
