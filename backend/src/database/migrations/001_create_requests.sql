CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL CHECK (char_length(trim(title)) BETWEEN 3 AND 100),
    description TEXT NOT NULL CHECK (char_length(trim(description)) BETWEEN 1 AND 1000),
    category VARCHAR(20) NOT NULL CHECK (category IN ('IT', 'Facilities', 'Other')),
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_requests_status ON requests (status);
CREATE INDEX idx_requests_created_at ON requests (created_at DESC);