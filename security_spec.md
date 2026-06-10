# Security Specification - DesignBridge Africa

This document traces the data invariants, threat metrics, and access validation blocks securing user profiles and jobs.

## 1. Data Invariants
- **User profiles** (`/users/{userId}`):
  - A user profile must correspond to the signed-in UID (`request.auth.uid == userId`).
  - Only authenticated users with verified emails may read other designer listings, but private PII fields are protected.
  - The `role` (Client, Designer, Admin) is protected against escalation. 
- **Job briefs** (`/jobs/{jobId}`):
  - A job brief cannot be updated of its `budget` values below zero.
  - Deleting/Updating a listing requires owning the resource: `existing().creatorId == request.auth.uid`.

## 2. Threat Analysis ("Dirty Dozen" Payload Rejection)
1. **Privilege Escalation**: Modifying role to `Admin` without trusted verification.
2. **Identity Theft**: Registering user profile where doc `userId` differs from `request.auth.uid`.
3. **Invalid Timestamps**: Submitting a client-controlled `createdAt` timestamp instead of server timestamp.
4. **Budget Poisoning**: Modifying a job to have high-length description or negative budget.
5. **Orphaned Writes**: Creating a job posting with non-existent creator identifier.
6. **Query Scraping**: Performing collection queries without proper filters.
7. **Ad-Hoc Data Injection**: Appending extra non-whitelisted keys on user updates.
8. **Malicious ID Poisioning**: Submitting 1.5MB junk-character strings on user records.
9. **Tampering Immutables**: Changing the `createdAt` timestamp on updating.
10. **State short-circuiting**: Circumventing approval states.
11. **Spoofed Email Headers**: Performing writes using an email format that didn't pass verification.
12. **PII Collection leaking**: Scanning administrative directories.

## 3. Fortress Rules Layout
The rules ensure strict ABAC boundaries, using `isValidId()`, `incoming()` and strict key constraints.
