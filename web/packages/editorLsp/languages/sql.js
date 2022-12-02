import {
  MonacoLanguageClient,
  MonacoServices,
  createConnection,
  ErrorAction,
  CloseAction
} from "monaco-languageclient";
import { listen } from "vscode-ws-jsonrpc";
import ReconnectingWebSocket from "reconnecting-websocket";

import sqlFormatter from '../sqlFormatter/sqlFormatter';

const richLanguageConfiguration = {
  comments: {
    lineComment: '--',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: '\'', close: '\'' },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: '\'', close: '\'' },
  ],
};

const langDefinition = {
  defaultToken: '',
  tokenPostfix: '.sql',
  ignoreCase: true,

  brackets: [
    { open: '[', close: ']', token: 'delimiter.square' },
    { open: '(', close: ')', token: 'delimiter.parenthesis' },
  ],

  keywords: [
    'ABORT_AFTER_WAIT',
    'ABSENT',
    'ABSOLUTE',
    'ABORT',
    'ACCENT_SENSITIVITY',
    'ACTION',
    'ACTIVATION',
    'ACTIVE',
    'ADD',
    'ADDRESS',
    'ADMIN',
    'AES',
    'AES_128',
    'AES_192',
    'AES_256',
    'AFFINITY',
    'AFTER',
    'AGGREGATE',
    'ALGORITHM',
    'ALL_CONSTRAINTS',
    'ALL_ERRORMSGS',
    'ALL_INDEXES',
    'ALL_LEVELS',
    'ALL_SPARSE_COLUMNS',
    'ALLOW_CONNECTIONS',
    'ALLOW_MULTIPLE_EVENT_LOSS',
    'ALLOW_PAGE_LOCKS',
    'ALLOW_ROW_LOCKS',
    'ALLOW_SINGLE_EVENT_LOSS',
    'ALLOW_SNAPSHOT_ISOLATION',
    'ALLOWED',
    'ALTER',
    'ANALYZE',
    'ANONYMOUS',
    'ANSI_DEFAULTS',
    'ANSI_NULL_DEFAULT',
    'ANSI_NULL_DFLT_OFF',
    'ANSI_NULL_DFLT_ON',
    'ANSI_NULLS',
    'ANSI_PADDING',
    'ANSI_WARNINGS',
    'APPEND',
    'APPLICATION',
    'APPLICATION_LOG',
    'ARCHIVE',
    'ARITHABORT',
    'ARITHIGNORE',
    'ARRAY',
    'AS',
    'ASC',
    'ASSEMBLY',
    'ASYMMETRIC',
    'ASYNCHRONOUS_COMMIT',
    'AT',
    'ATOMIC',
    'ATTACH',
    'ATTACH_REBUILD_LOG',
    'AUDIT',
    'AUDIT_GUID',
    'AUTHENTICATION',
    'AUTHORIZATION',
    'AUTO',
    'AUTOCOMMIT',
    'AUTO_CLEANUP',
    'AUTO_CLOSE',
    'AUTO_CREATE_STATISTICS',
    'AUTO_SHRINK',
    'AUTO_UPDATE_STATISTICS',
    'AUTO_UPDATE_STATISTICS_ASYNC',
    'AUTOMATED_BACKUP_PREFERENCE',
    'AUTOMATIC',
    'AVAILABILITY',
    'AVAILABILITY_MODE',
    'BACKUP',
    'BACKUP_PRIORITY',
    'BASE64',
    'BATCHSIZE',
    'BEFORE',
    'BEGIN',
    'BEGIN_DIALOG',
    'BIGINT',
    'BINARY',
    'BINDING',
    'BIT',
    'BLOCKERS',
    'BLOCKSIZE',
    'BOOLEAN',
    'BOTH',
    'BOUNDING_BOX',
    'BREAK',
    'BROKER',
    'BROKER_INSTANCE',
    'BROWSE',
    'BUCKET',
    'BUCKETS',
    'BUCKET_COUNT',
    'BUFFER',
    'BUFFERCOUNT',
    'BULK',
    'BULK_LOGGED',
    'BY',
    'CACHE',
    'CALL',
    'CALLED',
    'CALLER',
    'CAP_CPU_PERCENT',
    'CASCADE',
    'CASE',
    'CATALOG',
    'CATCH',
    'CELLS_PER_OBJECT',
    'CERTIFICATE',
    'CHANGE',
    'CHANGE_RETENTION',
    'CHANGE_TRACKING',
    'CHANGES',
    'CHAR',
    'CHARACTER',
    'CHECK',
    'CHECK_CONSTRAINTS',
    'CHECK_EXPIRATION',
    'CHECK_POLICY',
    'CHECKALLOC',
    'CHECKCATALOG',
    'CHECKCONSTRAINTS',
    'CHECKDB',
    'CHECKFILEGROUP',
    'CHECKIDENT',
    'CHECKPOINT',
    'CHECKTABLE',
    'CLASSIFIER_FUNCTION',
    'CLEANTABLE',
    'CLEANUP',
    'CLEAR',
    'CLOSE',
    'CLUSTER',
    'CLUSTERED',
    'CLUSTERSTATUS',
    'CODEPAGE',
    'COLLATE',
    'COLLECTION',
    'COLUMN',
    'COLUMN_SET',
    'COLUMNS',
    'COLUMNSTORE',
    'COLUMNSTORE_ARCHIVE',
    'COMMENT',
    'COMMIT',
    'COMMITTED',
    'COMPACT',
    'COMPACTIONS',
    'COMPATIBILITY_LEVEL',
    'COMPRESSION',
    'COMPUTE',
    'CONCAT',
    'CONCAT_NULL_YIELDS_NULL',
    'CONCATENATE',
    'CONF',
    'CONFIGURATION',
    'CONNECT',
    'CONSTRAINT',
    'CONTAINMENT',
    'CONTENT',
    'CONTEXT',
    'CONTINUE',
    'CONTINUE_AFTER_ERROR',
    'CONTRACT',
    'CONTRACT_NAME',
    'CONTROL',
    'CONVERSATION',
    'COOKIE',
    'COPY_ONLY',
    'COUNTER',
    'CPU',
    'CREATE',
    'CREATE_NEW',
    'CREATION_DISPOSITION',
    'CREDENTIAL',
    'CRYPTOGRAPHIC',
    'CUBE',
    'CURRENT',
    'CURRENT_DATE',
    'CURSOR',
    'CURSOR_CLOSE_ON_COMMIT',
    'CURSOR_DEFAULT',
    'CYCLE',
    'DATA',
    'DATA_COMPRESSION',
    'DATA_PURITY',
    'DATABASE',
    'DATABASES',
    'DATABASE_DEFAULT',
    'DATABASE_MIRRORING',
    'DATABASE_SNAPSHOT',
    'DATAFILETYPE',
    'DATE',
    'DATE_CORRELATION_OPTIMIZATION',
    'DATEFIRST',
    'DATEFORMAT',
    'DATETIME',
    'DATETIME2',
    'DATETIMEOFFSET',
    'DAY',
    'DAYOFWEEK',
    'DAYOFYEAR',
    'DAYS',
    'DB_CHAINING',
    'DBCC',
    'DBREINDEX',
    'DBPROPERTIES',
    'DDL_DATABASE_LEVEL_EVENTS',
    'DEADLOCK_PRIORITY',
    'DEALLOCATE',
    'DEC',
    'DECIMAL',
    'DECLARE',
    'DECRYPTION',
    'DEFAULT',
    'DEFAULT_DATABASE',
    'DEFAULT_FULLTEXT_LANGUAGE',
    'DEFAULT_LANGUAGE',
    'DEFAULT_SCHEMA',
    'DEFERRED',
    'DEFINED',
    'DEFINITION',
    'DELAY',
    'DELAYED_DURABILITY',
    'DELETE',
    'DELETED',
    'DELIMITED',
    'DENSITY_VECTOR',
    'DENY',
    'DEPENDENCY',
    'DEPENDENTS',
    'DES',
    'DESC',
    'DESCRIPTION',
    'DESCRIBE',
    'DESX',
    'DETAIL',
    'DHCP',
    'DIAGNOSTICS',
    'DIALOG',
    'DIFFERENTIAL',
    'DIRECTORIES',
    'DIRECTORY',
    'DIRECTORY_NAME',
    'DISABLE',
    'DISABLE_BROKER',
    'DISABLED',
    'DISK',
    'DISTINCT',
    'DISTRIBUTE',
    'DISTRIBUTED',
    'DOCUMENT',
    'DOUBLE',
    'DOW',
    'DROP',
    'DROP_EXISTING',
    'DROPCLEANBUFFERS',
    'DUMP',
    'DURABILITY',
    'DYNAMIC',
    'EDITION',
    'ELEMENTS',
    'ELEM_TYPE',
    'ELSE',
    'EMERGENCY',
    'EMPTY',
    'EMPTYFILE',
    'ENABLE',
    'ENABLE_BROKER',
    'ENABLED',
    'ENCRYPTION',
    'END',
    'ENDPOINT',
    'ENDPOINT_URL',
    'ERRLVL',
    'ERROR',
    'ERROR_BROKER_CONVERSATIONS',
    'ERRORFILE',
    'ESCAPE',
    'ESCAPED',
    'ESTIMATEONLY',
    'EVENT',
    'EVENT_RETENTION_MODE',
    'EXCHANGE',
    'EXCLUSIVE',
    'EXEC',
    'EXECUTABLE',
    'EXECUTE',
    'EXIT',
    'EXPAND',
    'EXPORT',
    'EXPIREDATE',
    'EXPIRY_DATE',
    'EXPLAIN',
    'EXPLICIT',
    'EXPRESSION',
    'EXTENDED',
    'EXTENDED_LOGICAL_CHECKS',
    'EXTENSION',
    'EXTERNAL',
    'EXTERNAL_ACCESS',
    'EXTRACT',
    'FAIL_OPERATION',
    'FAILOVER',
    'FAILOVER_MODE',
    'FAILURE_CONDITION_LEVEL',
    'FALSE',
    'FAN_IN',
    'FAST',
    'FAST_FORWARD',
    'FETCH',
    'FIELDS',
    'FIELDTERMINATOR',
    'FILE',
    'FILEFORMAT',
    'FILEGROUP',
    'FILEGROWTH',
    'FILELISTONLY',
    'FILENAME',
    'FILEPATH',
    'FILESTREAM',
    'FILESTREAM_ON',
    'FILETABLE_COLLATE_FILENAME',
    'FILETABLE_DIRECTORY',
    'FILETABLE_FULLPATH_UNIQUE_CONSTRAINT_NAME',
    'FILETABLE_NAMESPACE',
    'FILETABLE_PRIMARY_KEY_CONSTRAINT_NAME',
    'FILETABLE_STREAMID_UNIQUE_CONSTRAINT_NAME',
    'FILLFACTOR',
    'FILTERING',
    'FIRE_TRIGGERS',
    'FIRST',
    'FIRSTROW',
    'FLOAT',
    'FMTONLY',
    'FOLLOWING',
    'FOR',
    'FORCE',
    'FORCE_FAILOVER_ALLOW_DATA_LOSS',
    'FORCE_SERVICE_ALLOW_DATA_LOSS',
    'FORCED',
    'FORCEPLAN',
    'FORCESCAN',
    'FORCESEEK',
    'FOREIGN',
    'FORMATFILE',
    'FORMATTED',
    'FORMSOF',
    'FORWARD_ONLY',
    'FREE',
    'FREEPROCCACHE',
    'FREESESSIONCACHE',
    'FREESYSTEMCACHE',
    'FROM',
    'FULL',
    'FULLSCAN',
    'FULLTEXT',
    'FUNCTION',
    'FUNCTIONS',
    'GB',
    'GEOGRAPHY_AUTO_GRID',
    'GEOGRAPHY_GRID',
    'GEOMETRY_AUTO_GRID',
    'GEOMETRY_GRID',
    'GET',
    'GLOBAL',
    'GO',
    'GOTO',
    'GOVERNOR',
    'GRANT',
    'GRIDS',
    'GROUP',
    'GROUP_MAX_REQUESTS',
    'HADR',
    'HASH',
    'HASHED',
    'HAVING',
    'HEADERONLY',
    'HEALTH_CHECK_TIMEOUT',
    'HELP',
    'HIERARCHYID',
    'HIGH',
    'HINT',
    'HISTOGRAM',
    'HOLDLOCK',
    'HOLD_DDLTIME',
    'HONOR_BROKER_PRIORITY',
    'HOUR',
    'HOURS',
    'IDENTITY',
    'IDENTITY_INSERT',
    'IDENTITY_VALUE',
    'IDENTITYCOL',
    'IDXPROPERTIES',
    'IF',
    'IGNORE',
    'IGNORE_CONSTRAINTS',
    'IGNORE_DUP_KEY',
    'IGNORE_NONCLUSTERED_COLUMNSTORE_INDEX',
    'IGNORE_TRIGGERS',
    'IMAGE',
    'IMMEDIATE',
    'IMPERSONATE',
    'IMPLICIT_TRANSACTIONS',
    'IMPORT',
    'IMPORTANCE',
    'INCLUDE',
    'INCREMENT',
    'INCREMENTAL',
    'INDEX',
    'INDEXES',
    'INDEXDEFRAG',
    'INFINITE',
    'INFLECTIONAL',
    'INIT',
    'INITIATOR',
    'INPATH',
    'INPUT',
    'INPUTDRIVER',
    'INPUTFORMAT',
    'INPUTBUFFER',
    'INSENSITIVE',
    'INSERT',
    'INSERTED',
    'INSTEAD',
    'INT',
    'INTEGER',
    'INTERVAL',
    'INTO',
    'IO',
    'IP',
    'ISABOUT',
    'ISOLATION',
    'ITEMS',
    'JAR',
    'JOB',
    'KB',
    'KEEP',
    'KEEP_CDC',
    'KEEP_NULLS',
    'KEEP_REPLICATION',
    'KEEPDEFAULTS',
    'KEEPFIXED',
    'KEEPIDENTITY',
    'KEEPNULLS',
    'KERBEROS',
    'KEY',
    'KEY_SOURCE',
    'KEY_TYPE',
    'KEYS',
    'KEYSET',
    'KILL',
    'KILOBYTES_PER_BATCH',
    'LABELONLY',
    'LANGUAGE',
    'LAST',
    'LASTROW',
    'LATERAL',
    'LESS',
    'LEVEL',
    'LEVEL_1',
    'LEVEL_2',
    'LEVEL_3',
    'LEVEL_4',
    'LIFETIME',
    'LIMIT',
    'LINENO',
    'LINES',
    'LIST',
    'LISTENER',
    'LISTENER_IP',
    'LISTENER_PORT',
    'LOAD',
    'LOADHISTORY',
    'LOB_COMPACTION',
    'LOCAL',
    'LOCAL_SERVICE_NAME',
    'LOCATION',
    'LOCK',
    'LOCKS',
    'LOCK_ESCALATION',
    'LOCK_TIMEOUT',
    'LOGICAL',
    'LOGIN',
    'LOGSPACE',
    'LONG',
    'LOOP',
    'LOW',
    'MACRO',
    'MAP',
    'MAPJOIN',
    'MANUAL',
    'MARK',
    'MARK_IN_USE_FOR_REMOVAL',
    'MASTER',
    'MATERIALIZED',
    'MAX_CPU_PERCENT',
    'MAX_DISPATCH_LATENCY',
    'MAX_DOP',
    'MAX_DURATION',
    'MAX_EVENT_SIZE',
    'MAX_FILES',
    'MAX_IOPS_PER_VOLUME',
    'MAX_MEMORY',
    'MAX_MEMORY_PERCENT',
    'MAX_QUEUE_READERS',
    'MAX_ROLLOVER_FILES',
    'MAX_SIZE',
    'MAXDOP',
    'MAXERRORS',
    'MAXLENGTH',
    'MAXRECURSION',
    'MAXSIZE',
    'MAXTRANSFERSIZE',
    'MAXVALUE',
    'MB',
    'MEDIADESCRIPTION',
    'MEDIANAME',
    'MEDIAPASSWORD',
    'MEDIUM',
    'MEMBER',
    'MEMORY_OPTIMIZED',
    'MEMORY_OPTIMIZED_DATA',
    'MEMORY_OPTIMIZED_ELEVATE_TO_SNAPSHOT',
    'MEMORY_PARTITION_MODE',
    'MERGE',
    'MESSAGE',
    'MESSAGE_FORWARD_SIZE',
    'MESSAGE_FORWARDING',
    'METADATA',
    'MICROSECOND',
    'MILLISECOND',
    'MIN_CPU_PERCENT',
    'MIN_IOPS_PER_VOLUME',
    'MIN_MEMORY_PERCENT',
    'MINUS',
    'MINUTE',
    'MINUTES',
    'MINVALUE',
    'MIRROR',
    'MIRROR_ADDRESS',
    'MODIFY',
    'MONEY',
    'MONTH',
    'MONTHS',
    'MORE',
    'MOVE',
    'MSCK',
    'MULTI_USER',
    'MUST_CHANGE',
    'NAME',
    'NANOSECOND',
    'NATIONAL',
    'NATIVE_COMPILATION',
    'NCHAR',
    'NEGOTIATE',
    'NESTED_TRIGGERS',
    'NEW_ACCOUNT',
    'NEW_BROKER',
    'NEW_PASSWORD',
    'NEWNAME',
    'NEXT',
    'NO',
    'NO_BROWSETABLE',
    'NO_CHECKSUM',
    'NO_COMPRESSION',
    'NO_EVENT_LOSS',
    'NO_INFOMSGS',
    'NO_TRUNCATE',
    'NO_WAIT',
    'NOCHECK',
    'NOCOUNT',
    'NO_DROP',
    'NOEXEC',
    'NOEXPAND',
    'NOFORMAT',
    'NOINDEX',
    'NOINIT',
    'NOLOCK',
    'NON',
    'NON_TRANSACTED_ACCESS',
    'NONCLUSTERED',
    'NONE',
    'NORECOMPUTE',
    'NORECOVERY',
    'NORELY',
    'NORESEED',
    'NORESET',
    'NOREWIND',
    'NORMAL',
    'NOSCAN',
    'NOSKIP',
    'NOTIFICATION',
    'NOTRUNCATE',
    'NOUNLOAD',
    'NOVALIDATE',
    'NOWAIT',
    'NTEXT',
    'NTLM',
    'NULLS',
    'NUMANODE',
    'NUMERIC',
    'NUMERIC_ROUNDABORT',
    'NVARCHAR',
    'OBJECT',
    'OF',
    'OFF',
    'OFFLINE',
    'OFFSET',
    'OFFSETS',
    'OLD_ACCOUNT',
    'OLD_PASSWORD',
    'ON',
    'ON_FAILURE',
    'ONLINE',
    'ONLY',
    'OPEN',
    'OPEN_EXISTING',
    'OPENTRAN',
    'OPERATOR',
    'OPTIMISTIC',
    'OPTIMIZE',
    'OPTION',
    'ORDER',
    'OUT',
    'OUTPUT',
    'OUTPUTDRIVER',
    'OUTPUTBUFFER',
    'OUTPUTFORMAT',
    'OVER',
    'OVERRIDE',
    'OWNER',
    'OWNERSHIP',
    'OVERWRITE',
    'PAD_INDEX',
    'PAGE',
    'PAGE_VERIFY',
    'PAGECOUNT',
    'PAGLOCK',
    'PARAMETERIZATION',
    'PARSEONLY',
    'PARTIAL',
    'PARTIALSCAN',
    'PARTITION',
    'PARTITIONED',
    'PARTITIONS',
    'PARTNER',
    'PASSWORD',
    'PATH',
    'PER_CPU',
    'PER_NODE',
    'PERCENT',
    'PERMISSION_SET',
    'PERSISTED',
    'PHYSICAL_ONLY',
    'PLAN',
    'PLUS',
    'POISON_MESSAGE_HANDLING',
    'POOL',
    'POPULATION',
    'PORT',
    'PRECEDING',
    'PRECISION',
    'PRETTY',
    'PRESERVE',
    'PRIMARY',
    'PRIMARY_ROLE',
    'PRINT',
    'PRIOR',
    'PRIORITY',
    'PRIORITY_LEVEL',
    'PRINCIPALS',
    'PRIVATE',
    'PRIVILEGES',
    'PROC',
    'PROCCACHE',
    'PROCEDURE',
    'PROCEDURE_NAME',
    'PROCESS',
    'PROFILE',
    'PROPERTY',
    'PROPERTY_DESCRIPTION',
    'PROPERTY_INT_ID',
    'PROPERTY_SET_GUID',
    'PROTECTION',
    'PROVIDER',
    'PROVIDER_KEY_NAME',
    'PUBLIC',
    'PURGE',
    'PUT',
    'QUARTER',
    'QUERY',
    'QUERY_GOVERNOR_COST_LIMIT',
    'QUEUE',
    'QUEUE_DELAY',
    'QUOTED_IDENTIFIER',
    'RAISERROR',
    'RANGE',
    'RAW',
    'RC2',
    'RC4',
    'RC4_128',
    'READ',
    'READ_COMMITTED_SNAPSHOT',
    'READ_ONLY',
    'READ_ONLY_ROUTING_LIST',
    'READ_ONLY_ROUTING_URL',
    'READ_WRITE',
    'READ_WRITE_FILEGROUPS',
    'READCOMMITTED',
    'READCOMMITTEDLOCK',
    'READONLY',
    'READPAST',
    'READS',
    'READTEXT',
    'READUNCOMMITTED',
    'READWRITE',
    'REAL',
    'REBUILD',
    'RECEIVE',
    'RECOMPILE',
    'RECONFIGURE',
    'RECORDREADER',
    'RECORDWRITER',
    'RECOVERY',
    'RECURSIVE',
    'RECURSIVE_TRIGGERS',
    'REDUCE',
    'REFERENCES',
    'REGENERATE',
    'REGEXP',
    'RELATED_CONVERSATION',
    'RELATED_CONVERSATION_GROUP',
    'RELATIVE',
    'RELOAD',
    'RELY',
    'REMOTE',
    'REMOTE_PROC_TRANSACTIONS',
    'REMOTE_SERVICE_NAME',
    'REMOVE',
    'RENAME',
    'REORGANIZE',
    'REPAIR',
    'REPAIR_ALLOW_DATA_LOSS',
    'REPAIR_FAST',
    'REPAIR_REBUILD',
    'REPEATABLE',
    'REPEATABLEREAD',
    'REPLICA',
    'REPLICATION',
    'REQUEST_MAX_CPU_TIME_SEC',
    'REQUEST_MAX_MEMORY_GRANT_PERCENT',
    'REQUEST_MEMORY_GRANT_TIMEOUT_SEC',
    'REQUIRED',
    'RESAMPLE',
    'RESEED',
    'RESERVE_DISK_SPACE',
    'RESET',
    'RESOURCE',
    'RESTART',
    'RESTORE',
    'RESTRICT',
    'RESTRICTED_USER',
    'RESULT',
    'RESUME',
    'RETAINDAYS',
    'RETENTION',
    'RETURN',
    'RETURNS',
    'REVERT',
    'REVOKE',
    'REWIND',
    'REWINDONLY',
    'REWRITE',
    'RLIKE',
    'ROBUST',
    'ROLE',
    'ROLES',
    'ROLLBACK',
    'ROLLUP',
    'ROOT',
    'ROUTE',
    'ROW',
    'ROWCOUNT',
    'ROWGUIDCOL',
    'ROWLOCK',
    'ROWS',
    'ROWS_PER_BATCH',
    'ROWTERMINATOR',
    'ROWVERSION',
    'RSA_1024',
    'RSA_2048',
    'RSA_512',
    'RULE',
    'SAFE',
    'SAFETY',
    'SAMPLE',
    'SAVE',
    'SCHEDULER',
    'SCHEMA',
    'SCHEMAS',
    'SCHEMA_AND_DATA',
    'SCHEMA_ONLY',
    'SCHEMABINDING',
    'SCHEME',
    'SCROLL',
    'SCROLL_LOCKS',
    'SEARCH',
    'SECOND',
    'SECONDARY',
    'SECONDARY_ONLY',
    'SECONDARY_ROLE',
    'SECONDS',
    'SECRET',
    'SECURITY_LOG',
    'SECURITYAUDIT',
    'SELECT',
    'SELECTIVE',
    'SELF',
    'SEMI',
    'SEND',
    'SENT',
    'SEQUENCE',
    'SERDE',
    'SERDEPROPERTIES',
    'SERIALIZABLE',
    'SERVER',
    'SERVICE',
    'SERVICE_BROKER',
    'SERVICE_NAME',
    'SESSION',
    'SESSION_TIMEOUT',
    'SET',
    'SETS',
    'SETUSER',
    'SHARED',
    'SHOW',
    'SHOW_DATABASE',
    'SHOW_STATISTICS',
    'SHOWCONTIG',
    'SHOWPLAN',
    'SHOWPLAN_ALL',
    'SHOWPLAN_TEXT',
    'SHOWPLAN_XML',
    'SHRINKDATABASE',
    'SHRINKFILE',
    'SHUTDOWN',
    'SID',
    'SIGNATURE',
    'SIMPLE',
    'SINGLE_BLOB',
    'SINGLE_CLOB',
    'SINGLE_NCLOB',
    'SINGLE_USER',
    'SINGLETON',
    'SIZE',
    'SKEWED',
    'SKIP',
    'SMALLDATETIME',
    'SMALLINT',
    'SMALLMONEY',
    'SNAPSHOT',
    'SORT',
    'SORTED',
    'SORT_IN_TEMPDB',
    'SOURCE',
    'SPARSE',
    'SPATIAL',
    'SPATIAL_WINDOW_MAX_CELLS',
    'SPECIFICATION',
    'SPLIT',
    'SQL',
    'SQL_VARIANT',
    'SQLPERF',
    'SSL',
    'STANDBY',
    'START',
    'START_DATE',
    'STARTED',
    'STARTUP_STATE',
    'STAT_HEADER',
    'STATE',
    'STATEMENT',
    'STATIC',
    'STATISTICAL_SEMANTICS',
    'STATISTICS',
    'STATISTICS_INCREMENTAL',
    'STATISTICS_NORECOMPUTE',
    'STATS',
    'STATS_STREAM',
    'STATUS',
    'STATUSONLY',
    'STOP',
    'STOP_ON_ERROR',
    'STOPAT',
    'STOPATMARK',
    'STOPBEFOREMARK',
    'STOPLIST',
    'STOPPED',
    'STORED',
    'STREAMTABLE',
    'STRING',
    'STRUCT',
    'SUBJECT',
    'SUBSCRIPTION',
    'SUMMARY',
    'SUPPORTED',
    'SUSPEND',
    'SWITCH',
    'SYMMETRIC',
    'SYNCHRONOUS_COMMIT',
    'SYNONYM',
    'SYSNAME',
    'SYSTEM',
    'TABLE',
    'TABLES',
    'TABLERESULTS',
    'TABLESAMPLE',
    'TABLOCK',
    'TABLOCKX',
    'TAKE',
    'TAPE',
    'TARGET',
    'TARGET_RECOVERY_TIME',
    'TB',
    'TBLPROPERTIES',
    'TCP',
    'TEMPORARY',
    'TERMINATED',
    'TEXT',
    'TEXTIMAGE_ON',
    'TEXTSIZE',
    'THEN',
    'THESAURUS',
    'THROW',
    'TIES',
    'TIME',
    'TIMEOUT',
    'TIMER',
    'TIMESTAMP',
    'TIMESTAMPTZ',
    'TINYINT',
    'TO',
    'TOP',
    'TORN_PAGE_DETECTION',
    'TOUCH',
    'TRACEOFF',
    'TRACEON',
    'TRACESTATUS',
    'TRACK_CAUSALITY',
    'TRACK_COLUMNS_UPDATED',
    'TRAN',
    'TRANSACTION',
    'TRANSACTIONS',
    'TRANSFER',
    'TRANSFORM',
    'TRANSFORM_NOISE_WORDS',
    'TRIGGER',
    'TRIPLE_DES',
    'TRIPLE_DES_3KEY',
    'TRUE',
    'TRUNCATE',
    'TRUNCATEONLY',
    'TRUSTWORTHY',
    'TRY',
    'TSQL',
    'TWO_DIGIT_YEAR_CUTOFF',
    'TYPE',
    'TYPE_WARNING',
    'UNARCHIVE',
    'UNBOUNDED',
    'UNCHECKED',
    'UNCOMMITTED',
    'UNDEFINED',
    'UNDO',
    'UNSET',
    'UNSIGNED',
    'UNIONTYPE',
    'UNIQUE',
    'UNIQUEIDENTIFIER',
    'UNIQUEJOIN',
    'UNKNOWN',
    'UNLIMITED',
    'UNLOAD',
    'UNLOCK',
    'UNSAFE',
    'UPDATE',
    'UPDATETEXT',
    'UPDATEUSAGE',
    'UPDLOCK',
    'URI',
    'URL',
    'USE',
    'USED',
    'USER',
    'USEROPTIONS',
    'USING',
    'UTC',
    'UTC_TMESTAMP',
    'UTCTIMESTAMP',
    'VALID_XML',
    'VALIDATE',
    'VALIDATION',
    'VALUE',
    'VALUE_TYPE',
    'VALUES',
    'VARBINARY',
    'VARCHAR',
    'VARYING',
    'VECTORIZATION',
    'VERIFYONLY',
    'VERSION',
    'VIEW',
    'VIEW_METADATA',
    'VIEWS',
    'VISIBILITY',
    'WAIT_AT_LOW_PRIORITY',
    'WAITFOR',
    'WEEK',
    'WEEKS',
    'WEIGHT',
    'WELL_FORMED_XML',
    'WHEN',
    'WHERE',
    'WHILE',
    'WINDOW',
    'WINDOWS',
    'WITH',
    'WITHIN',
    'WITHOUT',
    'WITNESS',
    'WORK',
    'WORKLOAD',
    'WRITE',
    'WRITETEXT',
    'XACT_ABORT',
    'XLOCK',
    'XMAX',
    'XMIN',
    'XML',
    'XMLDATA',
    'XMLNAMESPACES',
    'XMLSCHEMA',
    'XQUERY',
    'XSINIL',
    'YEAR',
    'YEARS',
    'YMAX',
    'YMIN',
    'ZONE',
  ],
  operators: [
    // Logical
    'ALL', 'AND', 'ANY', 'BETWEEN', 'EXISTS', 'IN', 'LIKE', 'NOT', 'OR', 'SOME',
    // Set
    'EXCEPT', 'INTERSECT', 'UNION',
    // Join
    'APPLY', 'CROSS', 'FULL', 'INNER', 'JOIN', 'LEFT', 'OUTER', 'RIGHT',
    // Predicates
    'CONTAINS', 'FREETEXT', 'IS', 'NULL',
    // Pivoting
    'PIVOT', 'UNPIVOT',
    // Merging
    'MATCHED',
  ],
  builtinFunctions: [
    // Aggregate
    'AVG', 'CHECKSUM_AGG', 'COUNT', 'COUNT_BIG', 'GROUPING', 'GROUPING_ID', 'MAX', 'MIN', 'SUM', 'STDEV', 'STDEVP', 'VAR', 'VARP',
    // Analytic
    'CUME_DIST', 'FIRST_VALUE', 'LAG', 'LAST_VALUE', 'LEAD', 'PERCENTILE_CONT', 'PERCENTILE_DISC', 'PERCENT_RANK',
    // Collation
    'COLLATE', 'COLLATIONPROPERTY', 'TERTIARY_WEIGHTS',
    // Azure
    'FEDERATION_FILTERING_VALUE',
    // Conversion
    'CAST', 'CONVERT', 'PARSE', 'TRY_CAST', 'TRY_CONVERT', 'TRY_PARSE',
    // Cryptographic
    'ASYMKEY_ID', 'ASYMKEYPROPERTY', 'CERTPROPERTY', 'CERT_ID', 'CRYPT_GEN_RANDOM',
    'DECRYPTBYASYMKEY', 'DECRYPTBYCERT', 'DECRYPTBYKEY', 'DECRYPTBYKEYAUTOASYMKEY', 'DECRYPTBYKEYAUTOCERT', 'DECRYPTBYPASSPHRASE',
    'ENCRYPTBYASYMKEY', 'ENCRYPTBYCERT', 'ENCRYPTBYKEY', 'ENCRYPTBYPASSPHRASE', 'HASHBYTES', 'IS_OBJECTSIGNED',
    'KEY_GUID', 'KEY_ID', 'KEY_NAME', 'SIGNBYASYMKEY', 'SIGNBYCERT', 'SYMKEYPROPERTY', 'VERIFYSIGNEDBYCERT', 'VERIFYSIGNEDBYASYMKEY',
    // Cursor
    'CURSOR_STATUS',
    // Datatype
    'DATALENGTH', 'IDENT_CURRENT', 'IDENT_INCR', 'IDENT_SEED', 'IDENTITY', 'SQL_VARIANT_PROPERTY',
    // Datetime
    'CURRENT_TIMESTAMP', 'DATEADD', 'DATEDIFF', 'DATEFROMPARTS', 'DATENAME', 'DATEPART', 'DATETIME2FROMPARTS', 'DATETIMEFROMPARTS',
    'DATETIMEOFFSETFROMPARTS', 'DAY', 'EOMONTH', 'GETDATE', 'GETUTCDATE', 'ISDATE', 'MONTH', 'SMALLDATETIMEFROMPARTS', 'SWITCHOFFSET',
    'SYSDATETIME', 'SYSDATETIMEOFFSET', 'SYSUTCDATETIME', 'TIMEFROMPARTS', 'TODATETIMEOFFSET', 'YEAR',
    // Logical
    'CHOOSE', 'COALESCE', 'IIF', 'NULLIF',
    // Mathematical
    'ABS', 'ACOS', 'ASIN', 'ATAN', 'ATN2', 'CEILING', 'COS', 'COT', 'DEGREES', 'EXP', 'FLOOR', 'LOG', 'LOG10',
    'PI', 'POWER', 'RADIANS', 'RAND', 'ROUND', 'SIGN', 'SIN', 'SQRT', 'SQUARE', 'TAN',
    // Metadata
    'APP_NAME', 'APPLOCK_MODE', 'APPLOCK_TEST', 'ASSEMBLYPROPERTY', 'COL_LENGTH', 'COL_NAME', 'COLUMNPROPERTY',
    'DATABASE_PRINCIPAL_ID', 'DATABASEPROPERTYEX', 'DB_ID', 'DB_NAME', 'FILE_ID', 'FILE_IDEX', 'FILE_NAME', 'FILEGROUP_ID',
    'FILEGROUP_NAME', 'FILEGROUPPROPERTY', 'FILEPROPERTY', 'FULLTEXTCATALOGPROPERTY', 'FULLTEXTSERVICEPROPERTY',
    'INDEX_COL', 'INDEXKEY_PROPERTY', 'INDEXPROPERTY', 'OBJECT_DEFINITION', 'OBJECT_ID',
    'OBJECT_NAME', 'OBJECT_SCHEMA_NAME', 'OBJECTPROPERTY', 'OBJECTPROPERTYEX', 'ORIGINAL_DB_NAME', 'PARSENAME',
    'SCHEMA_ID', 'SCHEMA_NAME', 'SCOPE_IDENTITY', 'SERVERPROPERTY', 'STATS_DATE', 'TYPE_ID', 'TYPE_NAME', 'TYPEPROPERTY',
    // Ranking
    'DENSE_RANK', 'NTILE', 'RANK', 'ROW_NUMBER',
    // Replication
    'PUBLISHINGSERVERNAME',
    // Rowset
    'OPENDATASOURCE', 'OPENQUERY', 'OPENROWSET', 'OPENXML',
    // Security
    'CERTENCODED', 'CERTPRIVATEKEY', 'CURRENT_USER', 'HAS_DBACCESS', 'HAS_PERMS_BY_NAME', 'IS_MEMBER', 'IS_ROLEMEMBER', 'IS_SRVROLEMEMBER',
    'LOGINPROPERTY', 'ORIGINAL_LOGIN', 'PERMISSIONS', 'PWDENCRYPT', 'PWDCOMPARE', 'SESSION_USER', 'SESSIONPROPERTY', 'SUSER_ID', 'SUSER_NAME',
    'SUSER_SID', 'SUSER_SNAME', 'SYSTEM_USER', 'USER', 'USER_ID', 'USER_NAME',
    // String
    'ASCII', 'CHAR', 'CHARINDEX', 'CONCAT', 'DIFFERENCE', 'FORMAT', 'LEFT', 'LEN', 'LOWER', 'LTRIM', 'NCHAR', 'PATINDEX',
    'QUOTENAME', 'REPLACE', 'REPLICATE', 'REVERSE', 'RIGHT', 'RTRIM', 'SOUNDEX', 'SPACE', 'STR', 'STUFF', 'SUBSTRING', 'UNICODE', 'UPPER',
    // System
    'BINARY_CHECKSUM', 'CHECKSUM', 'CONNECTIONPROPERTY', 'CONTEXT_INFO', 'CURRENT_REQUEST_ID', 'ERROR_LINE', 'ERROR_NUMBER', 'ERROR_MESSAGE',
    'ERROR_PROCEDURE', 'ERROR_SEVERITY', 'ERROR_STATE', 'FORMATMESSAGE', 'GETANSINULL', 'GET_FILESTREAM_TRANSACTION_CONTEXT', 'HOST_ID',
    'HOST_NAME', 'ISNULL', 'ISNUMERIC', 'MIN_ACTIVE_ROWVERSION', 'NEWID', 'NEWSEQUENTIALID', 'ROWCOUNT_BIG', 'XACT_STATE',
    // TextImage
    'TEXTPTR', 'TEXTVALID',
    // Trigger
    'COLUMNS_UPDATED', 'EVENTDATA', 'TRIGGER_NESTLEVEL', 'UPDATE',
    // ChangeTracking
    'CHANGETABLE', 'CHANGE_TRACKING_CONTEXT', 'CHANGE_TRACKING_CURRENT_VERSION', 'CHANGE_TRACKING_IS_COLUMN_IN_MASK', 'CHANGE_TRACKING_MIN_VALID_VERSION',
    // FullTextSearch
    'CONTAINSTABLE', 'FREETEXTTABLE',
    // SemanticTextSearch
    'SEMANTICKEYPHRASETABLE', 'SEMANTICSIMILARITYDETAILSTABLE', 'SEMANTICSIMILARITYTABLE',
    // FileStream
    'FILETABLEROOTPATH', 'GETFILENAMESPACEPATH', 'GETPATHLOCATOR', 'PATHNAME',
    // ServiceBroker
    'GET_TRANSMISSION_STATUS',
  ],
  builtinVariables: [
    // Configuration
    '@@DATEFIRST', '@@DBTS', '@@LANGID', '@@LANGUAGE', '@@LOCK_TIMEOUT', '@@MAX_CONNECTIONS', '@@MAX_PRECISION', '@@NESTLEVEL',
    '@@OPTIONS', '@@REMSERVER', '@@SERVERNAME', '@@SERVICENAME', '@@SPID', '@@TEXTSIZE', '@@VERSION',
    // Cursor
    '@@CURSOR_ROWS', '@@FETCH_STATUS',
    // Datetime
    '@@DATEFIRST',
    // Metadata
    '@@PROCID',
    // System
    '@@ERROR', '@@IDENTITY', '@@ROWCOUNT', '@@TRANCOUNT',
    // Stats
    '@@CONNECTIONS', '@@CPU_BUSY', '@@IDLE', '@@IO_BUSY', '@@PACKET_ERRORS', '@@PACK_RECEIVED', '@@PACK_SENT',
    '@@TIMETICKS', '@@TOTAL_ERRORS', '@@TOTAL_READ', '@@TOTAL_WRITE',
  ],
  pseudoColumns: [
    '$ACTION', '$IDENTITY', '$ROWGUID', '$PARTITION',
  ],
  tokenizer: {
    root: [
      { include: '@comments' },
      { include: '@whitespace' },
      { include: '@pseudoColumns' },
      { include: '@numbers' },
      { include: '@strings' },
      { include: '@complexIdentifiers' },
      { include: '@scopes' },
      [/[;,.]/, 'delimiter'],
      [/[()]/, '@brackets'],
      [/[\w@#$]+/, {
        cases: {
          '@keywords': 'keyword',
          '@operators': 'operator',
          '@builtinVariables': 'predefined',
          '@builtinFunctions': 'predefined',
          '@default': 'identifier',
        },
      }],
      [/[<>=!%&+\-*/|~^]/, 'operator'],
    ],
    whitespace: [
      [/\s+/, 'white'],
    ],
    comments: [
      [/--+.*/, 'comment'],
      [/\/\*/, { token: 'comment.quote', next: '@comment' }],
    ],
    comment: [
      [/[^*/]+/, 'comment'],
      // Not supporting nested comments, as nested comments seem to not be standard?
      // i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
      // [/\/\*/, { token: 'comment.quote', next: '@push' }],    // nested comment not allowed :-(
      [/\*\//, { token: 'comment.quote', next: '@pop' }],
      [/./, 'comment'],
    ],
    pseudoColumns: [
      [/[$][A-Za-z_][\w@#$]*/, {
        cases: {
          '@pseudoColumns': 'predefined',
          '@default': 'identifier',
        },
      }],
    ],
    numbers: [
      [/0[xX][0-9a-fA-F]*/, 'number'],
      [/[$][+-]*\d*(\.\d*)?/, 'number'],
      [/((\d+(\.\d*)?)|(\.\d+))([eE][-+]?\d+)?/, 'number'],
    ],
    strings: [
      [/N'/, { token: 'string', next: '@string' }],
      [/'/, { token: 'string', next: '@string' }],
    ],
    string: [
      [/[^']+/, 'string'],
      [/''/, 'string'],
      [/'/, { token: 'string', next: '@pop' }],
    ],
    complexIdentifiers: [
      [/\[/, { token: 'identifier.quote', next: '@bracketedIdentifier' }],
      [/"/, { token: 'identifier.quote', next: '@quotedIdentifier' }],
    ],
    bracketedIdentifier: [
      [/[^\]]+/, 'identifier'],
      [/]]/, 'identifier'],
      [/]/, { token: 'identifier.quote', next: '@pop' }],
    ],
    quotedIdentifier: [
      [/[^"]+/, 'identifier'],
      [/""/, 'identifier'],
      [/"/, { token: 'identifier.quote', next: '@pop' }],
    ],
    scopes: [
      [/BEGIN\s+(DISTRIBUTED\s+)?TRAN(SACTION)?\b/i, 'keyword'],
      [/BEGIN\s+TRY\b/i, { token: 'keyword.try' }],
      [/END\s+TRY\b/i, { token: 'keyword.try' }],
      [/BEGIN\s+CATCH\b/i, { token: 'keyword.catch' }],
      [/END\s+CATCH\b/i, { token: 'keyword.catch' }],
      [/(BEGIN|CASE)\b/i, { token: 'keyword.block' }],
      [/END\b/i, { token: 'keyword.block' }],
      [/WHEN\b/i, { token: 'keyword.choice' }],
      [/THEN\b/i, { token: 'keyword.choice' }],
    ],
  },
};

let installed = false
let languageClient
/**
 * 创建websocket
 * @param {*} url
 */
function createWebSocket(url) {
  const socketOptions = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 10000,
    maxRetries: 10,
    debug: false,
  };
  return new ReconnectingWebSocket(url, [], socketOptions);
}

/**
 * 创建client
 * @param {*} connection
 */
function createLanguageClient(connection, documentSelector = ["sql"]) {
  return new MonacoLanguageClient({
    name: "SQL Language Server MonacoClient",
    clientOptions: {
      documentSelector,
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.DoNotRestart
      },
    },
    connectionProvider: {
      get: (errorHandler, closeHandler) => {
        return Promise.resolve(
          createConnection(connection, errorHandler, closeHandler)
        );
      },
    },
  });
}

/**
 * connect language server
 * @param {*} editor
 */
export function connectService(editor, url, cb) {
  if (url) {
    if (!installed) {
      installed = true;
      MonacoServices.install(editor);
    }
    if (window.__connected_sql_langserver !== true) {
      window.__connected_sql_langserver = true;
      const webSocket = createWebSocket(url);
      listen({
        webSocket,
        onConnection: (connection) => {
          if (languageClient) { languageClient.cleanUp() }
          // if (!languageClient) {
          languageClient = createLanguageClient(connection);
          const disposable = languageClient.start();
          connection.onClose(() => disposable.dispose());

          // }
          if (cb) {
            cb(languageClient)
          }
        },
      });
    } else {
      if (cb) {
        cb(languageClient)
      }
    }
  }
}

/**
 * register language
 * @param {*} monaco
 */
export function register(monaco) {
  monaco.languages.register({
    id: 'sql',
    extensions: ['.sql', '.hql', '.psql', '.tsql', '.jdbc', '.qmlsql', '.fql', '.ngql'],
    aliases: ['sql', 'hql', 'SQL', 'HQL'],
    mimetypes: ["application/json"],
  });

  monaco.languages.setLanguageConfiguration('sql', richLanguageConfiguration);
  monaco.languages.setMonarchTokensProvider('sql', langDefinition);

  // 处理格式化
  monaco.languages.registerDocumentFormattingEditProvider('sql', {
    provideDocumentFormattingEdits: function (model) {
      let range = model.getFullModelRange();
      let value = model.getValue();
      let newValue = sqlFormatter.format(value);
      return [
        {
          range: range,
          text: newValue,
        },
      ];
    },
  });
}

export default {
  config: richLanguageConfiguration,
  definition: langDefinition,
  register,
  connectService
}
