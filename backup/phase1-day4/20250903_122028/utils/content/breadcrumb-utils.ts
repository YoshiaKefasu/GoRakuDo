// ========== BREADCRUMB UTILITY FUNCTIONS ==========
/**
 * Generate breadcrumb data for tool pages
 * Story 2.10: Implement Breadcrumb Navigation
 * Creates structured breadcrumb data for tool index and article pages
 */

export interface BreadcrumbItem {
  title: string;
  url: string;
  isActive: boolean;
}

export interface BreadcrumbData {
  items: BreadcrumbItem[];
  ariaLabel: string;
}

/**
 * Generate breadcrumb data for tool index pages (e.g., /tools/anki)
 * @param toolName - The tool name (anki, migaku, yomitan)
 * @returns BreadcrumbData with structured breadcrumb items
 */
export function generateToolIndexBreadcrumb(toolName: string): BreadcrumbData {
  try {
    // Validate tool name against whitelist
    const validTools = ["anki", "migaku", "yomitan"];
    if (!validTools.includes(toolName)) {
      console.warn("⚠️ Invalid tool name for breadcrumb:", toolName);
      throw new Error("Invalid tool name");
    }

    // Format tool name for display
    const displayName = toolName.charAt(0).toUpperCase() + toolName.slice(1);

    const breadcrumbItems: BreadcrumbItem[] = [
      {
        title: "Home",
        url: "/",
        isActive: false,
      },
      {
        title: "Tools",
        url: "/tools",
        isActive: false,
      },
      {
        title: displayName,
        url: `/tools/${toolName}`,
        isActive: true,
      },
    ];

    return {
      items: breadcrumbItems,
      ariaLabel: `${displayName} tool navigation breadcrumb`,
    };
  } catch (error) {
    console.error("🚨 Error generating tool index breadcrumb:", error);
    // Return minimal breadcrumb as fallback
    return {
      items: [{ title: "Home", url: "/", isActive: true }],
      ariaLabel: "Navigation breadcrumb",
    };
  }
}

/**
 * Generate breadcrumb data for tool article pages (e.g., /tools/anki/apa-itu-anki)
 * @param toolName - The tool name (anki, migaku, yomitan)
 * @param articleTitle - The article title
 * @param articleSlug - The article slug
 * @returns BreadcrumbData with structured breadcrumb items
 */
export function generateToolArticleBreadcrumb(
  toolName: string,
  articleTitle: string,
  articleSlug: string,
): BreadcrumbData {
  try {
    // Validate tool name against whitelist
    const validTools = ["anki", "migaku", "yomitan"];
    if (!validTools.includes(toolName)) {
      console.warn("⚠️ Invalid tool name for breadcrumb:", toolName);
      throw new Error("Invalid tool name");
    }

    // Security: Sanitize article title and slug
    const sanitizedTitle = articleTitle.replace(/[<>\"'&]/g, "");
    const sanitizedSlug = articleSlug.replace(/[<>\"'&]/g, "");

    if (sanitizedTitle !== articleTitle || sanitizedSlug !== articleSlug) {
      console.warn("🚨 Security: XSS attempt detected in breadcrumb data");
      throw new Error("XSS attempt detected");
    }

    // Format tool name for display
    const displayName = toolName.charAt(0).toUpperCase() + toolName.slice(1);

    // Truncate article title if too long
    const truncatedTitle =
      sanitizedTitle.length > 30
        ? sanitizedTitle.substring(0, 30) + "..."
        : sanitizedTitle;

    const breadcrumbItems: BreadcrumbItem[] = [
      {
        title: "Home",
        url: "/",
        isActive: false,
      },
      {
        title: "Tools",
        url: "/tools",
        isActive: false,
      },
      {
        title: displayName,
        url: `/tools/${toolName}`,
        isActive: false,
      },
      {
        title: truncatedTitle,
        url: `/tools/${toolName}/${sanitizedSlug}`,
        isActive: true,
      },
    ];

    return {
      items: breadcrumbItems,
      ariaLabel: `${displayName} ${truncatedTitle} navigation breadcrumb`,
    };
  } catch (error) {
    console.error("🚨 Error generating tool article breadcrumb:", error);
    // Return minimal breadcrumb as fallback
    return {
      items: [{ title: "Home", url: "/", isActive: true }],
      ariaLabel: "Navigation breadcrumb",
    };
  }
}

/**
 * Validate breadcrumb data structure
 * @param data - The breadcrumb data to validate
 * @returns true if valid, false otherwise
 */
export function validateBreadcrumbData(data: BreadcrumbData): boolean {
  try {
    // Check if data has required properties
    if (
      !data ||
      !Array.isArray(data.items) ||
      typeof data.ariaLabel !== "string"
    ) {
      console.warn("⚠️ Invalid breadcrumb data structure");
      return false;
    }

    // Check if all items have required properties
    for (const item of data.items) {
      if (
        typeof item.title !== "string" ||
        typeof item.url !== "string" ||
        typeof item.isActive !== "boolean"
      ) {
        console.warn("⚠️ Invalid breadcrumb item structure");
        return false;
      }
    }

    // Check if there's exactly one active item
    const activeItems = data.items.filter((item) => item.isActive);
    if (activeItems.length !== 1) {
      console.warn("⚠️ Breadcrumb must have exactly one active item");
      return false;
    }

    return true;
  } catch (error) {
    console.error("🚨 Error validating breadcrumb data:", error);
    return false;
  }
}

/**
 * Sanitize breadcrumb item data
 * @param item - The breadcrumb item to sanitize
 * @returns Sanitized breadcrumb item
 */
export function sanitizeBreadcrumbItem(item: BreadcrumbItem): BreadcrumbItem {
  return {
    title: item.title.replace(/[<>\"'&]/g, ""),
    url: item.url.replace(/[<>\"'&]/g, ""),
    isActive: item.isActive,
  };
}
