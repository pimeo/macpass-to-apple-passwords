# Macpass to Apple Passwords
- Created at: 8/11/2024
- Created by: pimeo

Simple tool to generate a CSV file to facilitate the migration between Macpass and Apple Passwords

## Installation

```sh
git clone https://github.com/pimeo/macpass-to-apple-passwords.git
cd macpass-to-apple-passwords
npm install
```

## Usage

From Macpass, export your passwords to a xml file. Then use the tool to convert your xml file to a compatible Apple Passwords CSV file format.


## Using npm
```sh
npm run cli macpass-xml-to-apple-password-csv -- -i "<PATH_TO_YOUR_MACPASS_XML_FILE>" -o "apple-password-imports.csv"
```
Example: `PATH_TO_YOUR_MACPASS_XML_FILE` => `/Users/me/my-macpass-backup.xml`


## Using node
```sh
node index macpass-xml-to-apple-password-csv -i "<PATH_TO_YOUR_MACPASS_XML_FILE>" -o "apple-passwords-imports.csv"
```

Example: `PATH_TO_YOUR_MACPASS_XML_FILE` => `/Users/me/my-macpass-backup.xml`


Generated file will be created in the `outputs` directory at the root of the project. You may have to created it if program throws an error.

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
