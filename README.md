# Export macpass kdbx or csv to apple password application

- Created at: 8/11/2024
- Created by: pimeo


## Installation

```sh
npm install
```

## Use

```sh
npm run cli macpass-xml-to-apple-password-csv -- -i "~/Projects/export-macpass-to-apple-keychain/app/kdbx-to-csv/samples/macpass-backup-1.xml" -o "~/Projects/export-macpass-to-apple-keychain/app/kdbx-to-csv/outputs/apple-password-1.csv"

node index macpass-xml-to-apple-password-csv -i "~/Projects/export-macpass-to-apple-keychain/app/kdbx-to-csv/samples/macpass-backup-1.xml" -o "~/Projects/export-macpass-to-apple-keychain/app/kdbx-to-csv/outputs/apple-password-1.csv"
```

## Limitation

- Group creation is not supported.

## Macpass XML semantic tree

```txt
- KeyPassFile
  - Meta
    - Generator
    - DatabaseName
    - DatabaseNameChanged
    - DatabaseDescriptionChanged
    - DefaultUserNameChanged
    - MaintenanceHistoryDays
    - MasterKeyChanged
    - MasterKeyChangeRec
    - MasterKeyChangeForce
    - MemoryProtection
      - ProtectTitle
      - ProtectUserName
      - ProtectPassword
      - ProtectURL
      - ProtectNotes
    - RecycleBinEnabled
    - RecycleBinUUID
    - RecycleBinChanged
    - EntryTemplatesGroup
    - EntryTemplatesGroupChanged
    - HistoryMaxItems
    - HistoryMaxSize
    - LastSelectedGroup
    - LastTopVisibleGroup
    - Binaries
    - CustomData
          
  - Root
    - Group[]
      - UUID
      - Name
      - IconID
      - LastModificationTime
      - Times
        - CreationTime
        - LastAccessTime
        - ExpiryTime
        - Expires
        - UsageCount
        - LocationChanged
      - IsExpanded
      - DefaultAutoTypeSequence
      - EnableAutoType
      - EnableSearching
      - LastTopVisibleEntry
      - PreviousParentGroup
      - Group[]
        - &> {nested Group parent inherited contents}
        - Entry[]
          - UUID
          - IconID
          - ForegroundColor
          - BackgroundColor
          - OverrideURL
          - Tags
          - Times
            - LastModificationTime
            - CreationTime
            - LastAccessTime
            - ExpiryTime
            - Expires
            - UsageCount
            - LocationChanged
          - String
            - Key {contents:[Title|UserName|Password|URL|Notes]}
            - Value {attrs:[ProtectInMemory="True"]}
          - AutoType
            - Enabled
            - DataTransferObfuscation
          - History
            - Entry[]
              - &> {nested Entry parent inherited contents}

    - DeletedObjects
      - DeletedObject[]
        - UUID
        - DeletionTime
```
