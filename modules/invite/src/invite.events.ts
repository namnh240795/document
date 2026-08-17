export interface InvitationCreatedEvent {
  invitationId: string;
  email: string;
  role: string;
  inviteUrl: string;
  expiredAt: Date;
}

export interface InvitationAcceptedEvent {
  invitationId: string;
  email: string;
  role: string;
  employerId: string | null;
  userId: string;
}

export interface InvitationRevokedEvent {
  invitationId: string;
  email: string;
  role: string;
  revokedBy: string;
}

export interface InvitationResentEvent {
  invitationId: string;
  email: string;
  role: string;
  inviteUrl: string;
  expiredAt: Date;
}
