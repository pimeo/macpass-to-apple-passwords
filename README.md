# Macpass to Apple Password Manager
- Created at: 8/11/2024
- Created by: pimeo

This cli tool lets you to convert a macpass xml file to Apple Password application csv file.

## Installation

```sh
npm install
```

## Usage


## Using npm
```sh
npm run cli macpass-xml-to-apple-password-csv -- -i "~/Projects/export-macpass-to-apple-keychain/app/kdbx-to-csv/samples/macpass-backup-1.xml" -o "apple-password-1.csv"
```

## Using node
```sh
node index macpass-xml-to-apple-password-csv -i "~/Projects/export-macpass-to-apple-keychain/app/kdbx-to-csv/samples/macpass-backup-1.xml" -o "apple-password-1.csv"
```

Generated file will be created in the `outputs` directory at the root of the project.

## Limitation

- Group creation is not supported to Apple Password yet.

## Macpass XML semantic tree (11/15/2024 - version 0.8.1 (26030))

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
