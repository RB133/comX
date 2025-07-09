export enum Role {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
    QUEUE = 'QUEUE',
    BANNED = 'BANNED'
}

export enum Scope {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

export enum Status {
    INPROGRESS = 'INPROGRESS',
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED'
}

export enum Priority {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    LOW = 'LOW',
    MEDIUM = 'MEDIUM'
}