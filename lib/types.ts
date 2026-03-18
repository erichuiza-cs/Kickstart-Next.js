// Description: Type definitions for the Contentstack API

// PublishDetails object - Represents the details of publish functionality 
export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

// File object - Represents a file in Contentstack
export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[] | object;
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  _metadata?: object;
  publish_details: PublishDetails;
  $: any;
}

// Link object - Represents a hyperlink in Contentstack
export interface Link {
  title: string;
  href: string;
}

// Taxonomy object - Represents a taxonomy in Contentstack
export interface Taxonomy {
  taxonomy_uid: string;
  max_terms?: number;
  mandatory: boolean;
  non_localizable: boolean;
}

// Block object - Represents a generic modular block in Contentstack
export interface Block {
  type: "Block";
  _metadata: {
    uid: string;
  };
  layout: string;
  image?: {
    url: string;
    title: string;
    $?: any;
  };
  title?: string;
  copy?: string;
  $?: any;
}

// ShortForm object - Represents a short form block in Contentstack
export interface ShortForm {
  type: "ShortForm";
  title: string;
  description: string;
  cta: string;
  first_name_label: string;
  email_label: string;
  _metadata?: object;
  _version?: number;
  $?: any;
}

// LongForm object - Represents a long form block in Contentstack
export interface LongForm {
  type: "LongForm";
  title: string;
  description: string;
  cta: string;
  first_name_label: string;
  last_name_label: string;
  email_label: string;
  _metadata?: object;
  _version?: number;
  $?: any;
}

// Page object - Represents a page in Contentstack
export interface Page {
  uid: string;
  $: any;
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  rich_text?: string;
  blocks?: (Block | ShortForm | LongForm)[]; // Updated to include all block types
}