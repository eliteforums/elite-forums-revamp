import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ExternalLink, Copy, CheckCircle, XCircle } from "lucide-react";

interface StudentReview {
  id: string;
  name: string;
  college: string;
  review: string;
  is_approved: boolean;
  created_at: string;
}

const ReviewsManager = () => {
  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reviewFormUrl = `${window.location.origin}/review`;

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("student_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    const { error } = await supabase.from("student_reviews").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete review");
    } else {
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("student_reviews")
      .update({ is_approved: !currentStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update review");
    } else {
      toast.success(!currentStatus ? "Review approved" : "Review hidden");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: !currentStatus } : r))
      );
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(reviewFormUrl);
    toast.success("Review form link copied!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Share Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review Collection Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-2 bg-secondary rounded-lg text-sm text-foreground truncate">
              {reviewFormUrl}
            </code>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/review" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Student Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No reviews yet. Share the link above to collect reviews.
          </p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className={!review.is_approved ? "opacity-60" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{review.name}</span>
                      {review.is_approved ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">Approved</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Hidden</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.college}</p>
                    <p className="text-foreground/80 text-sm">"{review.review}"</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleApproval(review.id, review.is_approved)}
                      title={review.is_approved ? "Hide review" : "Approve review"}
                    >
                      {review.is_approved ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsManager;
